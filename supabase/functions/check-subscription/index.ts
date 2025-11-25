import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("Nenhum header de autorização fornecido");
      return new Response(JSON.stringify({ hasSubscription: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      console.log("Usuário não encontrado ou sem email");
      return new Response(JSON.stringify({ hasSubscription: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log("Verificando assinatura para:", user.email);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      console.log("Cliente não encontrado no Stripe");
      return new Response(JSON.stringify({ hasSubscription: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    console.log("Cliente encontrado:", customerId);
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    console.log("Assinaturas ativas encontradas:", subscriptions.data.length);

    const hasActiveSubscription = subscriptions.data.length > 0;

    if (hasActiveSubscription) {
      console.log("Assinatura ativa encontrada:", subscriptions.data[0].id);
    }

    return new Response(JSON.stringify({ 
      hasSubscription: hasActiveSubscription,
      subscriptionEnd: hasActiveSubscription 
        ? new Date(subscriptions.data[0].current_period_end * 1000).toISOString()
        : null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    return new Response(JSON.stringify({ 
      hasSubscription: false,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
