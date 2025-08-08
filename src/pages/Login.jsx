import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login(){
  const [email,setEmail]=React.useState('')
  const [password,setPassword]=React.useState('')
  const [error,setError]=React.useState('')
  const navigate = useNavigate()

  async function handle(e){
    e.preventDefault()
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    const user = data.user
    if (!user) { setError('Erro ao logar'); return }
    // fetch role
    const { data: profile, error: pErr } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = pErr ? 'repositor' : (profile?.role || 'repositor')
    // store minimal session info
    localStorage.setItem('confiar_user', JSON.stringify({ id: user.id, email: user.email, role }))
    navigate('/dashboard')
  }

  return (
    <div className="container">
      <h1>Confiar — Login</h1>
      <form onSubmit={handle}>
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Senha</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
        {error && <p style={{color:'crimson'}}>{error}</p>}
      </form>
    </div>
  )
}
