import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

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

    console.log('Login attempt for email:', email)

    if (!email || !password) {
      console.error('Missing email or password')
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
      console.error('User not found or error:', error)
      return new Response(
        JSON.stringify({ error: 'Email ou senha incorretos' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User found, verifying password')

    // Verificar senha usando bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      console.error('Invalid password')
      return new Response(
        JSON.stringify({ error: 'Email ou senha incorretos' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Login successful for user:', email)

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
    console.error('Login error:', error)
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
