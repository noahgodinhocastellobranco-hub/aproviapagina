import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cakto-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CAKTO-WEBHOOK] ${step}${detailsStr}`);
};

// Função para verificar a assinatura do webhook
async function verifyWebhookSignature(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature || !secret) {
    logStep("No signature or secret provided, skipping verification");
    return true; // Se não tiver assinatura configurada, aceita (para testes)
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Comparar assinaturas (pode vir com prefixo sha256=)
    const cleanSignature = signature.replace("sha256=", "");
    const isValid = cleanSignature === expectedSignature;
    
    logStep("Signature verification", { isValid });
    return isValid;
  } catch (error) {
    logStep("Signature verification error", { error: String(error) });
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Received webhook");
    
    const rawBody = await req.text();
    logStep("Raw body received", { length: rawBody.length });
    
    // Verificar assinatura se a chave secreta estiver configurada
    const webhookSecret = Deno.env.get("CAKTO_WEBHOOK_SECRET");
    const signature = req.headers.get("x-cakto-signature") || req.headers.get("x-webhook-signature");
    
    if (webhookSecret && signature) {
      const isValid = await verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        logStep("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }
    }
    
    const payload = JSON.parse(rawBody);
    logStep("Payload parsed", { event: payload.event || payload.type });

    // Cakto sends different event types
    const eventType = payload.event || payload.type || payload.action;
    const data = payload.data || payload;
    
    logStep("Event type", { eventType });

    // Extract customer email from various possible locations in the payload
    const customerEmail = 
      data.customer?.email || 
      data.buyer?.email || 
      data.email ||
      data.customer_email ||
      payload.customer?.email ||
      payload.buyer?.email;

    if (!customerEmail) {
      logStep("No customer email found in payload");
      return new Response(JSON.stringify({ received: true, warning: "No customer email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Customer email found", { email: customerEmail });

    // Find user by email
    const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
    
    let userId: string | null = null;
    if (!userError && userData?.users) {
      const user = userData.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());
      if (user) {
        userId = user.id;
        logStep("Found user ID", { userId });
      }
    }

    // Extract subscription/order details
    const subscriptionId = data.subscription_id || data.id || payload.subscription_id;
    const orderId = data.order_id || data.id || payload.order_id;
    const status = data.status || payload.status;
    const planName = data.product?.name || data.offer?.name || data.plan_name || "Mensal";
    const amount = data.amount || data.value || data.price || 24.90;

    // Determine subscription status based on event type
    let subscriptionStatus = "pending";
    
    const approvedEvents = [
      "purchase_approved", "purchase.approved", "payment.approved",
      "subscription.active", "subscription_activated", "order.paid",
      "approved", "paid", "completed", "complete", "ativa", "active"
    ];
    
    const cancelledEvents = [
      "subscription.cancelled", "subscription_cancelled", "subscription.canceled",
      "cancelled", "canceled", "refunded", "chargeback"
    ];

    if (approvedEvents.some(e => 
      eventType?.toLowerCase()?.includes(e) || 
      status?.toLowerCase() === e
    )) {
      subscriptionStatus = "active";
      logStep("Payment approved - activating subscription");
    } else if (cancelledEvents.some(e => 
      eventType?.toLowerCase()?.includes(e) || 
      status?.toLowerCase() === e
    )) {
      subscriptionStatus = "cancelled";
      logStep("Subscription cancelled");
    }

    // Check if subscription already exists
    const { data: existingSubscription } = await supabaseClient
      .from("subscriptions")
      .select("id")
      .eq("user_email", customerEmail.toLowerCase())
      .eq("status", "active")
      .maybeSingle();

    if (existingSubscription && subscriptionStatus === "active") {
      // Update existing subscription
      logStep("Updating existing subscription");
      const { error: updateError } = await supabaseClient
        .from("subscriptions")
        .update({
          status: subscriptionStatus,
          cakto_subscription_id: subscriptionId,
          cakto_order_id: orderId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id);

      if (updateError) {
        logStep("Error updating subscription", { error: updateError.message });
      }
    } else if (subscriptionStatus === "active") {
      // Create new subscription
      logStep("Creating new subscription");
      
      // Calculate expiration (30 days for monthly)
      const startedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error: insertError } = await supabaseClient
        .from("subscriptions")
        .insert({
          user_id: userId || "00000000-0000-0000-0000-000000000000",
          user_email: customerEmail.toLowerCase(),
          cakto_subscription_id: subscriptionId,
          cakto_order_id: orderId,
          status: subscriptionStatus,
          plan_name: planName,
          amount: amount,
          started_at: startedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        logStep("Error creating subscription", { error: insertError.message });
      } else {
        logStep("Subscription created successfully");
      }
    } else if (subscriptionStatus === "cancelled") {
      // Cancel subscription
      logStep("Cancelling subscription");
      const { error: cancelError } = await supabaseClient
        .from("subscriptions")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("user_email", customerEmail.toLowerCase())
        .eq("status", "active");

      if (cancelError) {
        logStep("Error cancelling subscription", { error: cancelError.message });
      }
    }

    return new Response(JSON.stringify({ 
      received: true,
      status: subscriptionStatus,
      email: customerEmail 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { error: errorMessage });
    
    // Always return 200 to avoid webhook retries
    return new Response(JSON.stringify({ 
      received: true,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
