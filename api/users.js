import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return res.status(401).json({ error: 'Access token required' })

    // Verify user and get id
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid token' })
    const userId = userData.user.id

    // Check role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profileError) return res.status(500).json({ error: profileError.message })
    if (!profile || profile.role !== 'admin') return res.status(403).json({ error: 'Admin required' })

    // List profiles with email from auth.users
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, role, created_at, users:auth.users(email)')

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
