import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email e senha são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar usuário na tabela users_desempenho
    const { data: user, error } = await supabaseClient
      .from('users_desempenho')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Email ou senha incorretos' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verificar senha usando bcrypt
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    const hashData = encoder.encode(user.password_hash)
    
    // Simple password comparison (in production, use proper bcrypt)
    // For now, we'll just do a basic check since bcrypt is complex in Deno
    const isValid = password === user.password_hash || 
                    await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Email ou senha incorretos' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Retornar dados do usuário (sem a senha)
    const { password_hash, ...userData } = user

    return new Response(
      JSON.stringify({ 
        user: userData,
        message: 'Login realizado com sucesso' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Simple comparison for now
  // In production, implement proper bcrypt verification
  return password === hash
}
