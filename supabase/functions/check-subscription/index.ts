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
    console.log("[CHECK-SUBSCRIPTION] Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("[CHECK-SUBSCRIPTION] No authorization header");
      return new Response(JSON.stringify({ hasSubscription: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      console.log("[CHECK-SUBSCRIPTION] User not found or no email");
      return new Response(JSON.stringify({ hasSubscription: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const userEmail = userData.user.email;
    const userId = userData.user.id;
    console.log("[CHECK-SUBSCRIPTION] User email:", userEmail);

    // Check if user is admin - admins have permanent free access
    console.log("[CHECK-SUBSCRIPTION] Checking if user is admin...");
    const { data: adminRole, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleError && adminRole) {
      console.log("[CHECK-SUBSCRIPTION] User is admin - granting permanent access");
      return new Response(JSON.stringify({ 
        hasSubscription: true,
        subscriptionEnd: null,
        source: "admin",
        isPermanent: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // First, check local subscriptions table (faster and more reliable)
    console.log("[CHECK-SUBSCRIPTION] Checking local database...");
    const { data: localSubscription, error: localError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_email", userEmail.toLowerCase())
      .eq("status", "active")
      .maybeSingle();

    if (!localError && localSubscription) {
      console.log("[CHECK-SUBSCRIPTION] Found active subscription in local DB:", localSubscription.id);
      return new Response(JSON.stringify({ 
        hasSubscription: true,
        subscriptionEnd: localSubscription.expires_at,
        source: "local"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log("[CHECK-SUBSCRIPTION] No local subscription found, checking Cakto API...");

    // Fallback: Check Cakto API directly
    try {
      const clientId = Deno.env.get("CAKTO_CLIENT_ID");
      const clientSecret = Deno.env.get("CAKTO_CLIENT_SECRET");

      if (!clientId || !clientSecret) {
        console.log("[CHECK-SUBSCRIPTION] Cakto credentials not configured");
        return new Response(JSON.stringify({ hasSubscription: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Get Cakto access token
      console.log("[CHECK-SUBSCRIPTION] Requesting Cakto token...");
      const tokenResponse = await fetch("https://api.cakto.com.br/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!tokenResponse.ok) {
        console.error("[CHECK-SUBSCRIPTION] Token request failed");
        return new Response(JSON.stringify({ hasSubscription: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      console.log("[CHECK-SUBSCRIPTION] Got Cakto token successfully");

      // Search for subscriptions by customer email
      console.log("[CHECK-SUBSCRIPTION] Fetching subscriptions from Cakto...");
      const subscriptionsResponse = await fetch(
        `https://api.cakto.com.br/api/subscriptions/?search=${encodeURIComponent(userEmail)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      let hasActiveSubscription = false;
      let subscriptionEnd = null;

      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json();
        console.log("[CHECK-SUBSCRIPTION] Subscriptions response:", JSON.stringify(subscriptionsData));

        const results = subscriptionsData.results || subscriptionsData || [];
        const activeSubscription = results.find((sub: any) => 
          sub.status === "active" || sub.status === "ativa" || sub.status === "paid"
        );

        if (activeSubscription) {
          console.log("[CHECK-SUBSCRIPTION] Active subscription found:", activeSubscription.id);
          hasActiveSubscription = true;
          subscriptionEnd = activeSubscription.next_billing_date || 
                           activeSubscription.expires_at || 
                           activeSubscription.current_period_end ||
                           null;

          // Sync to local database
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          
          await supabaseClient.from("subscriptions").upsert({
            user_id: userData.user.id,
            user_email: userEmail.toLowerCase(),
            cakto_subscription_id: activeSubscription.id,
            status: "active",
            expires_at: subscriptionEnd || expiresAt.toISOString(),
          }, {
            onConflict: "user_email"
          });
        }
      }

      // Also check for completed orders/purchases if no subscription found
      if (!hasActiveSubscription) {
        console.log("[CHECK-SUBSCRIPTION] Checking orders...");
        const ordersResponse = await fetch(
          `https://api.cakto.com.br/api/orders/?search=${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          console.log("[CHECK-SUBSCRIPTION] Orders response:", JSON.stringify(ordersData));
          
          const orders = ordersData.results || ordersData || [];
          
          const paidOrder = orders.find((order: any) => 
            order.status === "approved" || 
            order.status === "paid" || 
            order.status === "aprovado" ||
            order.status === "pago" ||
            order.status === "completed" ||
            order.status === "complete"
          );

          if (paidOrder) {
            console.log("[CHECK-SUBSCRIPTION] Paid order found:", paidOrder.id);
            hasActiveSubscription = true;
            subscriptionEnd = paidOrder.expires_at || null;

            // Sync to local database
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            
            await supabaseClient.from("subscriptions").upsert({
              user_id: userData.user.id,
              user_email: userEmail.toLowerCase(),
              cakto_order_id: paidOrder.id,
              status: "active",
              expires_at: subscriptionEnd || expiresAt.toISOString(),
            }, {
              onConflict: "user_email"
            });
          }
        }
      }

      console.log("[CHECK-SUBSCRIPTION] Result - hasSubscription:", hasActiveSubscription);
      return new Response(JSON.stringify({ 
        hasSubscription: hasActiveSubscription,
        subscriptionEnd: subscriptionEnd,
        source: "cakto"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } catch (caktoError) {
      console.error("[CHECK-SUBSCRIPTION] Cakto API error:", caktoError);
      return new Response(JSON.stringify({ hasSubscription: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CHECK-SUBSCRIPTION] ERROR:", errorMessage);
    
    return new Response(JSON.stringify({ 
      hasSubscription: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
