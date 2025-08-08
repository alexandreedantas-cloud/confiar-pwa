import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const authHeader = req.headers.authorization || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return res.status(401).json({ error: 'Access token required' })

    // Verify requester is admin
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid token' })
    const requesterId = userData.user.id

    const { data: rProfile, error: rProfileErr } = await supabaseAdmin.from('profiles').select('role').eq('id', requesterId).single()
    if (rProfileErr) return res.status(500).json({ error: rProfileErr.message })
    if (!rProfile || rProfile.role !== 'admin') return res.status(403).json({ error: 'Admin required' })

    const { email, password, role } = req.body
    if (!email || !password || !role) return res.status(400).json({ error: 'email, password and role required' })

    // Create user in Auth using admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    if (error) return res.status(500).json({ error: error.message })

    const userId = data.user.id
    // Insert profile
    const { error: pErr } = await supabaseAdmin.from('profiles').insert({ id: userId, role })
    if (pErr) return res.status(500).json({ error: pErr.message })

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
