import { useTasks } from '../../hooks/useTasks'
import StatCard from '../../components/tasks/StatCard'
import type { TaskCategory } from '../../types'

const CATS: TaskCategory[] = ['Travail','Personnel','Sante','Apprentissage','Finance']
const CAT_COLOR: Record<TaskCategory, string> = {
  Travail:'#7b8fff', Personnel:'#3ecf8e', Sante:'#f87171', Apprentissage:'#a78bfa', Finance:'#fbbf24',
}
const CAT_ICON: Record<TaskCategory, string> = {
  Travail:'🗂️', Personnel:'🌿', Sante:'❤️', Apprentissage:'📊', Finance:'💰',
}

function Donut({ pct }: { pct: number }) {
  const r = 54, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ position:'relative', width:148, height:148, flexShrink:0 }}>
      <svg viewBox="0 0 120 120" style={{ width:148, height:148 }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--s4)" strokeWidth={9}/>
        <circle cx="60" cy="60" r={r} fill="none"
          stroke="url(#dg)" strokeWidth={9} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          transform="rotate(-90 60 60)"/>
        <defs>
          <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6b7fff"/>
            <stop offset="100%" stopColor="#3ecf8e"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:26, fontWeight:900, color:'var(--green)', letterSpacing:'-1px' }}>{pct}%</span>
        <span style={{ fontSize:11, color:'var(--t3)', marginTop:2 }}>complété</span>
      </div>
    </div>
  )
}

export default function StatsPage() {
  const { stats, todayTasks } = useTasks()
  const todayDone = todayTasks.filter(t => t.status === 'done').length

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28, maxWidth:1100 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize:28, fontWeight:800, color:'var(--t1)', letterSpacing:'-1px', marginBottom:8 }}>Statistiques</h1>
        <p style={{ fontSize:14, color:'var(--t3)' }}>Vue d'ensemble de votre productivité</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        <StatCard value={stats.total}   label="Tâches au total" icon="🗒️" color="#7b8fff"/>
        <StatCard value={stats.done}    label="Terminées"        icon="✅" color="var(--green)"/>
        <StatCard value={stats.pending} label="À faire"          icon="⏳" color="var(--amber)"/>
        <StatCard value={stats.urgent}  label="Urgentes"         icon="🔥" color="var(--red)"/>
      </div>

      {/* Middle row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* Progression */}
        <div className="panel" style={{ padding:'32px' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:24 }}>Progression globale</p>
          <div style={{ display:'flex', alignItems:'center', gap:32 }}>
            <Donut pct={stats.completionRate}/>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:17, fontWeight:700, color:'var(--t1)', marginBottom:6, letterSpacing:'-.02em' }}>
                {stats.done} sur {stats.total} tâches
              </p>
              <p style={{ fontSize:13.5, color:'var(--t2)', marginBottom:20, lineHeight:1.5 }}>
                Continuez comme ça — vous êtes sur la bonne voie !
              </p>
              <div style={{ height:8, borderRadius:99, background:'var(--s4)', overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#6b7fff,#3ecf8e)', width:`${stats.completionRate}%`, transition:'width 1s cubic-bezier(.22,.68,0,1)' }}/>
              </div>
              <p style={{ fontSize:12, color:'var(--t3)', marginTop:8 }}>{stats.completionRate}% des tâches terminées</p>
            </div>
          </div>
        </div>

        {/* Aujourd'hui */}
        <div className="panel" style={{ padding:'32px' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:24 }}>
            Aujourd'hui
          </p>
          {todayTasks.length === 0 ? (
            <div style={{ textAlign:'center', padding:'28px 0' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🎉</div>
              <p style={{ fontSize:14, color:'var(--t2)', fontWeight:500 }}>Rien de prévu aujourd'hui !</p>
              <p style={{ fontSize:13, color:'var(--t3)', marginTop:6 }}>Profitez de votre journée.</p>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {todayTasks.map(t => (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:12, background:'var(--s2)', border:'1px solid var(--l1)' }}>
                    <div style={{
                      width:20, height:20, borderRadius:'50%', flexShrink:0,
                      border:`2px solid ${t.status==='done' ? 'var(--green)':'var(--l3)'}`,
                      background: t.status==='done' ? 'var(--green)':'transparent',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {t.status==='done' && <svg width={9} height={9} fill="none" stroke="#04060e" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span style={{ flex:1, fontSize:13.5, color: t.status==='done' ? 'var(--t3)':'var(--t1)', textDecoration: t.status==='done' ? 'line-through':'none', letterSpacing:'-.01em' }}>{t.name}</span>
                    <span style={{ fontSize:12, color:'var(--t3)', fontWeight:500 }}>{t.dueTime}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16, paddingTop:16, borderTop:'1px solid var(--l1)' }}>
                <span style={{ fontSize:13, color:'var(--t3)' }}>{todayDone}/{todayTasks.length} terminées</span>
                <div style={{ height:6, width:120, borderRadius:99, background:'var(--s4)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:99, background:'var(--green)', width:`${todayTasks.length ? todayDone/todayTasks.length*100 : 0}%` }}/>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Par catégorie */}
      <div className="panel" style={{ padding:'32px' }}>
        <p style={{ fontSize:11, fontWeight:700, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:28 }}>Par catégorie</p>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {CATS.map(cat => {
            const { total, done } = stats.byCategory[cat] ?? { total:0, done:0 }
            if (!total) return null
            const pct = Math.round((done/total)*100)
            const color = CAT_COLOR[cat]
            return (
              <div key={cat}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:20 }}>{CAT_ICON[cat]}</span>
                    <span style={{ fontSize:14.5, fontWeight:600, color:'var(--t1)', letterSpacing:'-.01em' }}>{cat}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <span style={{ fontSize:13, color:'var(--t3)', fontWeight:400 }}>{done}/{total} tâches</span>
                    <span style={{ fontSize:15, fontWeight:800, color, letterSpacing:'-1px', minWidth:44, textAlign:'right' }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height:7, borderRadius:99, background:'var(--s4)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:99, background:color, width:`${pct}%`, transition:'width .8s cubic-bezier(.22,.68,0,1)', opacity:.85 }}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
