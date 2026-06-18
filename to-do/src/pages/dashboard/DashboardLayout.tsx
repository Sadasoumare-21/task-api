import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/TaskContext'
import Sidebar from '../../components/layout/Sidebar'

export default function DashboardLayout() {
  const { isAuthenticated, user, logout } = useTaskContext()
  const navigate = useNavigate()
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--canvas)' }}>
      <Sidebar />

      {/* Main area */}
      <div style={{ flex:1, marginLeft:264, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* Top bar */}
        <header style={{
          height:60, display:'flex', alignItems:'center', justifyContent:'flex-end',
          padding:'0 40px', gap:16, flexShrink:0,
          background:'rgba(4,6,14,.75)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid var(--l1)',
          position:'sticky', top:0, zIndex:40,
        }}>
          {user && (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:30, height:30, borderRadius:9, flexShrink:0,
                background:'linear-gradient(135deg,#6b7fff,#5c5ef4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, color:'#fff',
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:600, color:'var(--t1)', letterSpacing:'-.01em', lineHeight:1.1 }}>{user.name}</div>
                <div style={{ fontSize:11.5, color:'var(--t3)', marginTop:1 }}>{user.email}</div>
              </div>
            </div>
          )}
          <div style={{ width:1, height:20, background:'var(--l2)' }}/>
          <button style={{ fontSize:13, color:'var(--t3)', background:'transparent', border:'none', cursor:'pointer', fontFamily:'Outfit,sans-serif', padding:'4px 0', transition:'color .15s' }}
            onClick={() => { logout(); navigate('/') }}
            onMouseOver={e => e.currentTarget.style.color='var(--red)'}
            onMouseOut={e  => e.currentTarget.style.color='var(--t3)'}>
            Déconnexion
          </button>
        </header>

        <main style={{ flex:1, padding:'48px 40px', overflowY:'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
