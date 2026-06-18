import { NavLink, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/TaskContext'
import { useTasks } from '../../hooks/useTasks'
import type { TaskCategory } from '../../types'

const CAT_ICON: Record<TaskCategory, string> = {
  Travail:'🗂️', Personnel:'🌿', Sante:'❤️', Apprentissage:'📊', Finance:'💰',
}
const CAT_COLOR: Record<TaskCategory, string> = {
  Travail:'#7b8fff', Personnel:'#3ecf8e', Sante:'#f87171', Apprentissage:'#a78bfa', Finance:'#fbbf24',
}

export default function Sidebar() {
  const { logout, filters, setFilters } = useTaskContext()
  const { stats, CATS } = useTasks()
  const navigate = useNavigate()

  return (
    <aside style={{
      position:'fixed', left:0, top:0, bottom:0, width:264,
      display:'flex', flexDirection:'column',
      background:'var(--s0)',
      borderRight:'1px solid var(--l1)',
    }}>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div style={{ padding:'28px 24px 24px', borderBottom:'1px solid var(--l1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:36, height:36, borderRadius:10, flexShrink:0,
            background:'linear-gradient(145deg,#6b7fff,#5c5ef4)',
            boxShadow:'0 4px 14px rgba(92,114,245,.45)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width={18} height={18} fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--t1)', letterSpacing:'-.03em', lineHeight:1 }}>TaskFlow</div>
            <div style={{ fontSize:11.5, color:'var(--t3)', marginTop:3, fontWeight:400 }}>Espace de travail</div>
          </div>
        </div>
      </div>

      {/* ── Nav links ─────────────────────────────────────────────────── */}
      <nav style={{ flex:1, overflowY:'auto', padding:'16px 12px' }}>
        <div style={{ marginBottom:6 }}>
          <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize:18, lineHeight:1, flexShrink:0 }}>🗒️</span>
            <span style={{ flex:1 }}>Mes taches</span>
            {stats.pending > 0 && (
              <span className="cat-badge active">{stats.pending}</span>
            )}
          </NavLink>
        </div>
        <div style={{ marginBottom:20 }}>
          <NavLink to="/dashboard/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize:18, lineHeight:1, flexShrink:0 }}>📊</span>
            <span style={{ flex:1 }}>Statistiques</span>
          </NavLink>
        </div>

        {/* Categories */}
        <div style={{ padding:'0 4px', marginBottom:10 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'var(--t4)', textTransform:'uppercase', letterSpacing:'1.2px' }}>
            Catégories
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {CATS.map(cat => {
            const n = stats.byCategory[cat]?.total ?? 0
            const isActive = filters.category === cat
            return (
              <button key={cat} className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { setFilters({ category: isActive ? 'all' : cat }); navigate('/dashboard') }}>
                <span style={{ fontSize:17, lineHeight:1, flexShrink:0 }}>{CAT_ICON[cat]}</span>
                <span style={{ flex:1 }}>{cat}</span>
                {n > 0 && (
                  <span className={`cat-badge ${isActive ? 'active' : ''}`}
                        style={ !isActive ? { color: CAT_COLOR[cat], background:`${CAT_COLOR[cat]}18` } : {} }>
                    {n}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── Footer / Logout ───────────────────────────────────────────── */}
      <div style={{ padding:'12px', borderTop:'1px solid var(--l1)' }}>
        <button className="nav-item" style={{ color:'var(--t3)' }}
          onClick={() => { logout(); navigate('/') }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.color='var(--red)' }}
          onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.color='var(--t3)' }}>
          <span style={{ fontSize:17 }}>↩</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
