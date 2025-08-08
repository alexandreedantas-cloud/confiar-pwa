import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Users(){
  const navigate = useNavigate()
  const raw = localStorage.getItem('confiar_user')
  const user = raw ? JSON.parse(raw) : null
  React.useEffect(()=>{ if (!user) navigate('/login') },[])
  const [list,setList]=React.useState([])
  const [loading,setLoading]=React.useState(false)
  const [error,setError]=React.useState('')
  const [email,setEmail]=React.useState('')
  const [password,setPassword]=React.useState('')
  const [role,setRole]=React.useState('repositor')

  React.useEffect(()=>{ if (user && user.role==='admin') fetchList() },[])

  async function fetchList(){
    setLoading(true); setError('')
    try{
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/users', { headers: { Authorization: 'Bearer '+token } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erro')
      setList(json)
    }catch(err){ setError(err.message) } finally { setLoading(false) }
  }

  async function handleCreate(e){
    e.preventDefault(); setError('')
    try{
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/create-user', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ email, password, role })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erro')
      setEmail(''); setPassword(''); setRole('repositor')
      fetchList()
    }catch(err){ setError(err.message) }
  }

  if (!user || user.role!=='admin') return <div className="container"><p>Acesso negado.</p></div>

  return (
    <div className="container">
      <h2>Gerenciar Usuários</h2>
      <section style={{marginTop:12}}>
        <h3>Lista</h3>
        {loading ? <p>Carregando...</p> : (
          <table>
            <thead><tr><th>Email</th><th>Role</th><th>Criado</th></tr></thead>
            <tbody>
              {list.map(u=>(
                <tr key={u.id}><td>{u.users?.email || '-'}</td><td>{u.role}</td><td>{u.created_at}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {error && <p style={{color:'crimson'}}>{error}</p>}
      </section>
      <section style={{marginTop:20}}>
        <h3>Adicionar Usuário</h3>
        <form onSubmit={handleCreate}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Senha</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <label>Papel</label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="repositor">repositor</option>
            <option value="admin">admin</option>
          </select>
          <button type="submit">Criar usuário</button>
        </form>
      </section>
    </div>
  )
}
