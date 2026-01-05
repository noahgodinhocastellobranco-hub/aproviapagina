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

// Validação de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Sanitização de string
function sanitizeString(input: string | undefined, maxLength: number): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

// Validação do payload
function validatePayload(payload: unknown): { valid: boolean; error?: string; data?: WebhookPayload } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid payload format' };
  }

  const p = payload as Record<string, unknown>;

  // Validar email (obrigatório)
  if (!p.email || typeof p.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }

  const email = p.email.trim().toLowerCase();
  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Sanitizar nome (opcional)
  const name = sanitizeString(p.name as string | undefined, 100);

  // Validar senha (opcional, se fornecida)
  let password: string | undefined;
  if (p.password && typeof p.password === 'string') {
    if (p.password.length < 6 || p.password.length > 72) {
      return { valid: false, error: 'Password must be between 6 and 72 characters' };
    }
    password = p.password;
  }

  return {
    valid: true,
    data: { email, name, password }
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received webhook request from n8n');
    
    // Validar Content-Type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let rawPayload: unknown;
    try {
      rawPayload = await req.json();
    } catch {
      console.error('Failed to parse JSON body');
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar e sanitizar payload
    const validation = validatePayload(rawPayload);
    if (!validation.valid || !validation.data) {
      console.error('Validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = validation.data;
    console.log('Payload validated:', { email: payload.email, name: payload.name });

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
      email_confirm: true,
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
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created successfully:', userData.user?.id);

    // Return success with user details (não retorna a senha por segurança)
    return new Response(
      JSON.stringify({
        success: true,
        user_id: userData.user?.id,
        email: userData.user?.email,
        message: 'User created successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
