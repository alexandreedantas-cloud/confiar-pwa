import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard(){
  const navigate = useNavigate()
  const raw = localStorage.getItem('confiar_user')
  const user = raw ? JSON.parse(raw) : null
  if (!user) { navigate('/login'); return null }
  const role = user.role || 'repositor'
  return (
    <div className="container">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Painel Confiar</h2>
        <div>{user.email} — <em>{role}</em></div>
      </header>
      <nav style={{marginTop:16}}>
        <Link to="/dashboard">Dashboard</Link> | <Link to="/products">Produtos</Link> { role==='admin' && <>| <Link to="/users">Usuários</Link></> }
      </nav>
      <main style={{marginTop:20}}>
        <h3>Bem-vindo ao painel</h3>
        <p>Use o menu para navegar.</p>
      </main>
    </div>
  )
}
