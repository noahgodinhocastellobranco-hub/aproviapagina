import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to get Cakto access token
async function getCaktoToken(): Promise<string> {
  const clientId = Deno.env.get("CAKTO_CLIENT_ID");
  const clientSecret = Deno.env.get("CAKTO_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Cakto credentials not configured");
  }

  console.log("[CHECK-SUBSCRIPTION] Requesting Cakto token...");
  const response = await fetch("https://api.cakto.com.br/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[CHECK-SUBSCRIPTION] Token request failed:", errorText);
    throw new Error(`Failed to get Cakto token: ${response.status}`);
  }

  const data = await response.json();
  console.log("[CHECK-SUBSCRIPTION] Got Cakto token successfully");
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
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
    console.log("[CHECK-SUBSCRIPTION] User email:", userEmail);

    // Get Cakto access token
    const accessToken = await getCaktoToken();

    // Search for subscriptions by customer email
    console.log("[CHECK-SUBSCRIPTION] Fetching subscriptions...");
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
        
        // Check for any approved/paid order
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
        }
      }
    }

    console.log("[CHECK-SUBSCRIPTION] Result - hasSubscription:", hasActiveSubscription);
    return new Response(JSON.stringify({ 
      hasSubscription: hasActiveSubscription,
      subscriptionEnd: subscriptionEnd 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

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
