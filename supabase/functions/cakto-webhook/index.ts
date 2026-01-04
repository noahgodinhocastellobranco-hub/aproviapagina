import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    console.log("[CAKTO-WEBHOOK] Received webhook");
    
    const payload = await req.json();
    console.log("[CAKTO-WEBHOOK] Payload:", JSON.stringify(payload));

    // Cakto sends different event types
    const eventType = payload.event || payload.type || payload.action;
    const data = payload.data || payload;
    
    console.log("[CAKTO-WEBHOOK] Event type:", eventType);

    // Extract customer email from various possible locations in the payload
    const customerEmail = 
      data.customer?.email || 
      data.buyer?.email || 
      data.email ||
      data.customer_email ||
      payload.customer?.email ||
      payload.buyer?.email;

    if (!customerEmail) {
      console.log("[CAKTO-WEBHOOK] No customer email found in payload");
      return new Response(JSON.stringify({ received: true, warning: "No customer email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log("[CAKTO-WEBHOOK] Customer email:", customerEmail);

    // Find user by email
    const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
    
    let userId: string | null = null;
    if (!userError && userData?.users) {
      const user = userData.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());
      if (user) {
        userId = user.id;
        console.log("[CAKTO-WEBHOOK] Found user ID:", userId);
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
      console.log("[CAKTO-WEBHOOK] Payment approved - activating subscription");
    } else if (cancelledEvents.some(e => 
      eventType?.toLowerCase()?.includes(e) || 
      status?.toLowerCase() === e
    )) {
      subscriptionStatus = "cancelled";
      console.log("[CAKTO-WEBHOOK] Subscription cancelled");
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
      console.log("[CAKTO-WEBHOOK] Updating existing subscription");
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
        console.error("[CAKTO-WEBHOOK] Error updating subscription:", updateError);
      }
    } else if (subscriptionStatus === "active") {
      // Create new subscription
      console.log("[CAKTO-WEBHOOK] Creating new subscription");
      
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
        console.error("[CAKTO-WEBHOOK] Error creating subscription:", insertError);
      } else {
        console.log("[CAKTO-WEBHOOK] Subscription created successfully");
      }
    } else if (subscriptionStatus === "cancelled") {
      // Cancel subscription
      console.log("[CAKTO-WEBHOOK] Cancelling subscription");
      const { error: cancelError } = await supabaseClient
        .from("subscriptions")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("user_email", customerEmail.toLowerCase())
        .eq("status", "active");

      if (cancelError) {
        console.error("[CAKTO-WEBHOOK] Error cancelling subscription:", cancelError);
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
    console.error("[CAKTO-WEBHOOK] ERROR:", errorMessage);
    
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
