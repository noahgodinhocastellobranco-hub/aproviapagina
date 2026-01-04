import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Cache for the access token
let cachedToken: { token: string; expiresAt: number } | null = null;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CAKTO-AUTH] Getting access token");

    const clientId = Deno.env.get("CAKTO_CLIENT_ID");
    const clientSecret = Deno.env.get("CAKTO_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error("Cakto credentials not configured");
    }

    // Check if we have a valid cached token
    const now = Date.now();
    if (cachedToken && cachedToken.expiresAt > now + 60000) {
      console.log("[CAKTO-AUTH] Using cached token");
      return new Response(JSON.stringify({ access_token: cachedToken.token }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Request new token
    console.log("[CAKTO-AUTH] Requesting new token from Cakto");
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
      console.error("[CAKTO-AUTH] Token request failed:", errorText);
      throw new Error(`Failed to get Cakto token: ${response.status}`);
    }

    const data = await response.json();
    console.log("[CAKTO-AUTH] Token received successfully");

    // Cache the token (expires_in is in seconds)
    const expiresIn = data.expires_in || 3600;
    cachedToken = {
      token: data.access_token,
      expiresAt: now + expiresIn * 1000,
    };

    return new Response(JSON.stringify({ access_token: data.access_token }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CAKTO-AUTH] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
