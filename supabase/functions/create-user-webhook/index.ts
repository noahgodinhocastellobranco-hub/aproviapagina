import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  email: string;
  name?: string;
  password?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received webhook request from n8n');
    
    const payload: WebhookPayload = await req.json();
    console.log('Payload received:', { email: payload.email, name: payload.name });

    // Validate required fields
    if (!payload.email) {
      console.error('Missing email in payload');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Generate a random password if not provided
    const userPassword = payload.password || `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
    
    console.log('Creating user with email:', payload.email);

    // Create the user with admin client
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: userPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: payload.name || '',
        created_via: 'cakto_purchase'
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      
      // Check if user already exists
      if (createError.message.includes('already registered')) {
        console.log('User already exists, returning success');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'User already exists',
            user_id: null 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created successfully:', userData.user?.id);

    // Return success with user details
    return new Response(
      JSON.stringify({
        success: true,
        user_id: userData.user?.id,
        email: userData.user?.email,
        password: userPassword, // Return password so it can be sent to the user
        message: 'User created successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
