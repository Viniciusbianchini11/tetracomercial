import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const users = [
      'vinicius.soares@tetraeducacao.com.br',
      'alexia.martins@tetraeducacao.com.br',
      'anacecilia@tetraeducacao.com.br',
      'elton.hoeltgebaum@tetraeducacao.com.br',
      'barbara.soares@tetraeducacao.com.br',
      'kimberly.freitas@tetraeducacao.com.br',
      'geovanna.farias@tetraeducacao.com.br',
      'sabrina.silva@tetraeducacao.com.br',
      'vladmir.correa@tetraeducacao.com.br',
      'thaynara.alves@tetraeducacao.com.br',
      'wemille@tetraeducacao.com.br',
    ]

    const results = []

    for (const email of users) {
      // Create user
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'Tetra123',
        email_confirm: true,
      })

      if (userError) {
        console.error(`Error creating user ${email}:`, userError)
        results.push({ email, success: false, error: userError.message })
        continue
      }

      // Create profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({ id: userData.user.id })

      if (profileError) {
        console.error(`Error creating profile for ${email}:`, profileError)
      }

      // Assign admin role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({ user_id: userData.user.id, role: 'admin' })

      if (roleError) {
        console.error(`Error assigning role to ${email}:`, roleError)
        results.push({ email, success: false, error: roleError.message })
        continue
      }

      results.push({ email, success: true })
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
