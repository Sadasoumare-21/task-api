import { useNavigate } from 'react-router-dom'

function Logo({ size = 'md' }: { size?: 'sm'|'md'|'lg' }) {
  const s = size === 'sm' ? 30 : size === 'lg' ? 42 : 36
  const fs = size === 'sm' ? '15px' : size === 'lg' ? '20px' : '17px'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{
        width:s, height:s, borderRadius:10, flexShrink:0,
        background:'linear-gradient(145deg,#6b7fff,#5b5ef4)',
        boxShadow:'0 4px 16px rgba(91,115,245,.5)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width={s*.5} height={s*.5} fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <span style={{ fontSize:fs, fontWeight:700, color:'var(--t1)', letterSpacing:'-.03em' }}>TaskFlow</span>
    </div>
  )
}

function Navbar() {
  const nav = useNavigate()
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:50,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 48px', height:64,
      background:'rgba(6,8,15,.8)', backdropFilter:'blur(24px)',
      borderBottom:'1px solid rgba(255,255,255,.05)',
    }}>
      <Logo />
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <button className="btn btn-nav-ghost" onClick={() => nav('/login')}>Se connecter</button>
        <button className="btn btn-nav"       onClick={() => nav('/register')}>Commencer →</button>
      </div>
    </nav>
  )
}

function AppPreview() {
  const rows = [
    { name:'Finaliser le rapport Q1', done:false, cat:'🗂️', urgent:true },
    { name:'Seance de sport — cardio 30min', done:true, cat:'❤️', urgent:false },
    { name:'Lire chapitre 4 de Clean Code', done:false, cat:'📊', urgent:false },
  ]
  return (
    <div style={{
      borderRadius:24, overflow:'hidden',
      background:'#080d1a',
      border:'1px solid rgba(255,255,255,.08)',
      boxShadow:'0 40px 120px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.04)',
    }}>
      {/* Title bar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width:12, height:12, borderRadius:'50%', background:c, display:'block' }}/>)}
        <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
          <div style={{ fontSize:12, color:'#3d5070', background:'rgba(255,255,255,.04)', padding:'4px 16px', borderRadius:8 }}>
            taskflow.app/dashboard
          </div>
        </div>
      </div>
      <div style={{ display:'flex', minHeight:280 }}>
        {/* Sidebar */}
        <div style={{ width:156, flexShrink:0, padding:'16px 12px', borderRight:'1px solid rgba(255,255,255,.05)' }}>
          <p style={{ fontSize:10, fontWeight:700, color:'#1e2d45', textTransform:'uppercase', letterSpacing:'1px', padding:'0 6px', marginBottom:10 }}>Nav</p>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 10px', borderRadius:10, background:'rgba(91,115,245,.14)', color:'#7b8fff', fontSize:12, fontWeight:600, marginBottom:4 }}>
            🗒️ Mes taches
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 10px', borderRadius:10, color:'#3d5070', fontSize:12 }}>
            📊 Statistiques
          </div>
        </div>
        {/* Main */}
        <div style={{ flex:1, padding:'20px 20px' }}>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
            {[{v:'6',c:'#7b8fff',l:'Actives'},{v:'4',c:'#34d399',l:'Terminees'},{v:'2',c:'#f87171',l:'Urgentes'}].map(s => (
              <div key={s.l} style={{ background:'var(--surface-2)', borderRadius:12, border:'1px solid rgba(255,255,255,.06)', padding:'14px', textAlign:'center' }}>
                <p style={{ fontSize:24, fontWeight:900, color:s.c, lineHeight:1 }}>{s.v}</p>
                <p style={{ fontSize:10, color:'#3d5070', marginTop:4 }}>{s.l}</p>
              </div>
            ))}
          </div>
          {/* Rows */}
          <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(255,255,255,.06)', background:'var(--surface-1)' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', borderBottom: i<rows.length-1 ? '1px solid rgba(255,255,255,.04)':undefined }}>
                <div style={{
                  width:18, height:18, borderRadius:'50%', flexShrink:0,
                  border:`2px solid ${r.done ? '#34d399':'rgba(255,255,255,.12)'}`,
                  background: r.done ? '#34d399':'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {r.done && <svg width={9} height={9} fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                </div>
                <span style={{ flex:1, fontSize:12, color: r.done ? '#3d5070':'#c4d4f0', textDecoration: r.done ? 'line-through':'none' }}>{r.name}</span>
                <span style={{ fontSize:15 }}>{r.cat}</span>
                {r.urgent && <span style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', display:'block' }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const STATS = [{n:'12k+',l:'Utilisateurs actifs'},{n:'98%',l:'Taux de satisfaction'},{n:'3.2M',l:'Taches completees'},{n:'4.9★',l:'Note moyenne'}]

const FEATS = [
  {icon:'⚡',t:'Organisation intelligente',d:'Categorisez vos taches par domaine, priorite et echeance pour une clarte totale.'},
  {icon:'📊',t:'Statistiques en temps reel',d:'Visualisez votre productivite avec des graphiques dynamiques et des metriques avancees.'},
  {icon:'🎯',t:'Suivi de progression',d:'Marquez vos taches comme terminees et suivez votre avancement au quotidien.'},
  {icon:'🔔',t:'Rappels intelligents',d:'Definissez des heures precises pour ne plus jamais manquer une echeance.'},
  {icon:'🌙',t:'Interface sombre elegante',d:'Un design pense pour les longues sessions de travail, confortable pour les yeux.'},
  {icon:'📱',t:'100% Responsive',d:"Accedez a vos taches depuis n'importe quel appareil, a tout moment."},
]

export default function LandingPage() {
  const nav = useNavigate()
  return (
    <div style={{ background:'var(--canvas)', minHeight:'100vh' }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ position:'relative', paddingTop:160, paddingBottom:120, textAlign:'center', overflow:'hidden' }}>
        {/* Glow blobs */}
        <div style={{ position:'absolute', top:-100, left:'50%', transform:'translateX(-50%)', width:900, height:600, background:'radial-gradient(ellipse 60% 60% at 50% 0%,rgba(91,115,245,.13) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:200, left:'15%', width:400, height:400, background:'radial-gradient(circle,rgba(167,139,250,.06) 0%,transparent 60%)', pointerEvents:'none', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', top:200, right:'15%', width:400, height:400, background:'radial-gradient(circle,rgba(34,211,238,.04) 0%,transparent 60%)', pointerEvents:'none', borderRadius:'50%' }}/>

        <div style={{ position:'relative', maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>
          {/* Badge */}
          <div className="fx-up" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'7px 18px', borderRadius:99, marginBottom:48,
            background:'rgba(255,255,255,.04)',
            border:'1px solid rgba(255,255,255,.1)',
            fontSize:13, fontWeight:500, color:'var(--t2)',
          }}>
            <span style={{ color:'var(--amber)', fontSize:14 }}>✦</span>
            Application de productivite N°1
          </div>

          {/* Headline */}
          <h1 className="fx-up delay-1" style={{
            fontSize:'clamp(54px,8vw,108px)',
            fontWeight:900, lineHeight:.92,
            letterSpacing:'-4px',
            marginBottom:36,
          }}>
            <span style={{ color:'var(--t1)', display:'block' }}>Organisez votre</span>
            <span style={{ color:'var(--t1)', display:'block' }}>vie, <span className="grad-shimmer">une tache</span></span>
            <span style={{ display:'block' }}><span className="grad-shimmer">a la fois</span></span>
          </h1>

          {/* Sub */}
          <p className="fx-up delay-2" style={{ fontSize:20, color:'var(--t2)', maxWidth:520, margin:'0 auto 56px', lineHeight:1.65, fontWeight:400 }}>
            TaskFlow transforme votre facon de travailler. Gerez, priorisez et accomplissez vos objectifs avec clarte et efficacite.
          </p>

          {/* CTAs */}
          <div className="fx-up delay-3" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginBottom:80, flexWrap:'wrap' }}>
            <button className="btn btn-hero" onClick={() => nav('/register')}>🚀 Demarrer gratuitement</button>
            <button className="btn btn-ghost-hero" onClick={() => nav('/login')}>Se connecter</button>
          </div>

          {/* Preview */}
          <div className="fx-up delay-4 fx-bob" style={{ maxWidth:820, margin:'0 auto' }}>
            <AppPreview />
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop:'1px solid var(--line-1)', borderBottom:'1px solid var(--line-1)', padding:'64px 40px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, textAlign:'center' }}>
          {STATS.map(s => (
            <div key={s.n}>
              <p style={{ fontSize:42, fontWeight:900, letterSpacing:'-2px', lineHeight:1 }} className="grad">{s.n}</p>
              <p style={{ fontSize:14, color:'var(--t2)', marginTop:8, fontWeight:500 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section style={{ padding:'120px 40px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:72 }}>
          <div style={{
            display:'inline-block', padding:'6px 18px', borderRadius:99, marginBottom:24,
            background:'var(--blue-dim)', border:'1px solid rgba(91,115,245,.25)',
            fontSize:13, fontWeight:600, color:' var(--blue-light)',
          }}>Fonctionnalites</div>
          <h2 style={{ fontSize:52, fontWeight:900, letterSpacing:'-2.5px', marginBottom:16 }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ fontSize:18, color:'var(--t2)', fontWeight:400 }}>Des outils penses pour maximiser votre productivite quotidienne</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {FEATS.map((f, i) => (
            <div key={i} className="panel-sm" style={{ padding:36, transition:'transform .2s, border-color .2s', cursor:'default' }}
                 onMouseOver={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform='translateY(-4px)'; d.style.borderColor='rgba(91,115,245,.25)' }}
                 onMouseOut={e  => { const d = e.currentTarget as HTMLDivElement; d.style.transform='translateY(0)';    d.style.borderColor='var(--line-2)' }}>
              <div style={{ fontSize:40, marginBottom:20 }}>{f.icon}</div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'var(--t1)', marginBottom:10, letterSpacing:'-.02em' }}>{f.t}</h3>
              <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.7, fontWeight:400 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BLOCK ─────────────────────────────────────────────────── */}
      <section style={{ padding:'0 40px 120px' }}>
        <div className="panel" style={{ maxWidth:800, margin:'0 auto', padding:'80px 60px', textAlign:'center', background:'var(--surface-1)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:500, height:300, background:'radial-gradient(ellipse,rgba(91,115,245,.1) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <h2 style={{ fontSize:48, fontWeight:900, letterSpacing:'-2.5px', marginBottom:16, position:'relative' }}>
            Pret a passer a la<br/>vitesse superieure ?
          </h2>
          <p style={{ fontSize:17, color:'var(--t2)', marginBottom:48, position:'relative' }}>
            Rejoignez des milliers d'utilisateurs qui ont transforme leur productivite.
          </p>
          <button className="btn btn-hero" onClick={() => nav('/register')} style={{ position:'relative' }}>
            Creer un compte gratuit →
          </button>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid var(--line-1)', padding:'40px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <Logo size="sm" />
        <p style={{ fontSize:13, color:'var(--t3)' }}>© 2026 TaskFlow — Application de gestion de taches personnelles</p>
      </footer>
    </div>
  )
}
