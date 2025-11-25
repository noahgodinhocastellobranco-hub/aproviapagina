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

  try {
    console.log("[ADMIN-DASHBOARD] Function started");

    // Criar cliente Supabase com service role key para acesso total
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verificar autenticação do usuário
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("[ADMIN-DASHBOARD] No authorization header");
      throw new Error("Não autorizado");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.log("[ADMIN-DASHBOARD] User authentication failed");
      throw new Error("Não autorizado");
    }

    console.log("[ADMIN-DASHBOARD] User authenticated:", userData.user.id);

    // Verificar se o usuário é admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      console.log("[ADMIN-DASHBOARD] User is not admin");
      throw new Error("Acesso negado: apenas administradores");
    }

    console.log("[ADMIN-DASHBOARD] Admin access confirmed");

    // Buscar todos os usuários
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error("[ADMIN-DASHBOARD] Error fetching users:", usersError);
      throw usersError;
    }

    console.log(`[ADMIN-DASHBOARD] Found ${users.length} users`);

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2024-11-20.acacia",
    });

    // Buscar todas as assinaturas ativas com dados do customer expandidos
    const subscriptions = await stripe.subscriptions.list({ 
      status: "active",
      limit: 100,
      expand: ['data.customer']
    });

    console.log(`[ADMIN-DASHBOARD] Found ${subscriptions.data.length} active subscriptions`);

    // Mapear usuários com suas assinaturas
    const usersWithSubscriptions = users.map(user => {
      const userSubscription = subscriptions.data.find((sub: Stripe.Subscription) => {
        if (!sub.customer) return false;
        
        // Customer pode ser string (ID) ou objeto expandido
        if (typeof sub.customer === 'string') {
          return false; // Não conseguimos comparar com string ID
        }
        
        return (sub.customer as Stripe.Customer).email === user.email;
      });

      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        subscription: userSubscription ? {
          id: userSubscription.id,
          status: userSubscription.status,
          current_period_end: new Date(userSubscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: userSubscription.cancel_at_period_end
        } : null
      };
    });

    console.log("[ADMIN-DASHBOARD] Response prepared successfully");

    return new Response(JSON.stringify({ 
      users: usersWithSubscriptions,
      total_users: users.length,
      total_subscriptions: subscriptions.data.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[ADMIN-DASHBOARD] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});