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
    throw new Error(`Failed to get Cakto token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
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
    console.log("[CANCEL-SUBSCRIPTION] Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Usuário não autenticado");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Erro de autenticação: ${userError.message}`);
    }

    const user = userData.user;
    if (!user?.email) {
      throw new Error("Usuário não encontrado");
    }

    console.log("[CANCEL-SUBSCRIPTION] User email:", user.email);

    // Get Cakto access token
    const accessToken = await getCaktoToken();
    console.log("[CANCEL-SUBSCRIPTION] Got Cakto access token");

    // Search for active subscriptions by customer email
    const subscriptionsResponse = await fetch(
      `https://api.cakto.com.br/api/subscriptions/?search=${encodeURIComponent(user.email)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!subscriptionsResponse.ok) {
      throw new Error("Falha ao buscar assinaturas");
    }

    const subscriptionsData = await subscriptionsResponse.json();
    const results = subscriptionsData.results || subscriptionsData || [];
    
    const activeSubscription = results.find((sub: any) => 
      sub.status === "active" || sub.status === "ativa" || sub.status === "paid"
    );

    if (!activeSubscription) {
      throw new Error("Nenhuma assinatura ativa encontrada");
    }

    console.log("[CANCEL-SUBSCRIPTION] Found subscription:", activeSubscription.id);

    // Cancel the subscription via Cakto API
    const cancelResponse = await fetch(
      `https://api.cakto.com.br/api/subscriptions/${activeSubscription.id}/cancel/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      console.error("[CANCEL-SUBSCRIPTION] Cancel failed:", errorText);
      throw new Error(`Falha ao cancelar assinatura: ${cancelResponse.status}`);
    }

    console.log("[CANCEL-SUBSCRIPTION] Subscription cancelled successfully");

    return new Response(JSON.stringify({ 
      success: true,
      message: "Assinatura cancelada com sucesso" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao cancelar assinatura";
    console.error("[CANCEL-SUBSCRIPTION] ERROR:", errorMessage);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
