import React from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './pages/Login'

export default function App(){
  const navigate = useNavigate()
  React.useEffect(()=>{
    const token = localStorage.getItem('supabase.auth.token')
    if (token) navigate('/dashboard')
    else navigate('/login')
  },[])
  return <div>Redirecionando...</div>
}
