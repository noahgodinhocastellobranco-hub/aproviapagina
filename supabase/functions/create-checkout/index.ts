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

  // OAuth client_credentials: muitos servidores exigem Basic Auth (client_id:client_secret)
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const formBody = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const response = await fetch("https://api.cakto.com.br/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${basicAuth}`,
      "Accept": "application/json",
    },
    body: formBody.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[CREATE-CHECKOUT] Token request failed:", errorText);
    throw new Error(`Failed to get Cakto token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CREATE-CHECKOUT] Function started");

    const { email, offerId } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    if (!offerId) {
      throw new Error("Offer ID is required");
    }

    console.log("[CREATE-CHECKOUT] Email:", email);
    console.log("[CREATE-CHECKOUT] Offer ID:", offerId);

    // Get Cakto access token
    const accessToken = await getCaktoToken();
    console.log("[CREATE-CHECKOUT] Got Cakto access token");

    // Create checkout link via Cakto API
    const checkoutResponse = await fetch("https://api.cakto.com.br/api/checkout-links/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offer: offerId,
        customer_email: email,
      }),
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error("[CREATE-CHECKOUT] Checkout creation failed:", errorText);
      throw new Error(`Failed to create checkout: ${checkoutResponse.status}`);
    }

    const checkoutData = await checkoutResponse.json();
    console.log("[CREATE-CHECKOUT] Checkout created:", checkoutData);

    // Cakto returns the checkout URL directly
    const checkoutUrl = checkoutData.url || checkoutData.checkout_url || `https://pay.cakto.com.br/${checkoutData.id}`;

    return new Response(JSON.stringify({ url: checkoutUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-CHECKOUT] ERROR:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
