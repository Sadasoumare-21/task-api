import { NavLink, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/TaskContext'
import { useTasks } from '../../hooks/useTasks'
import type { TaskCategory } from '../../types'
import { useState, useRef, useEffect, useCallback } from 'react'
import { fetchCurrentWeather, type WeatherData } from '../../services/weather.service'

const CAT_ICON: Record<TaskCategory, string> = {
  Travail:'🗂️', Personnel:'🌿', Sante:'❤️', Apprentissage:'📊', Finance:'💰', Projets:'📁', Autre:'📌',
}
const CAT_COLOR: Record<TaskCategory, string> = {
  Travail:'#7b8fff', Personnel:'#3ecf8e', Sante:'#f87171', Apprentissage:'#a78bfa', Finance:'#fbbf24', Projets:'#6366f1', Autre:'#94a3b8',
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

      {/* ── Widget Météo ───────────────────────────────────────────────── */}
      <SidebarWeather />

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

/* ══════════════════════════════════════════════════════════════════════════════
   SidebarWeather — widget météo compact intégré dans la sidebar
   ══════════════════════════════════════════════════════════════════════════════ */

const WEATHER_EMOJI: Record<string, string> = {
  Clear:'☀️', Clouds:'☁️', Rain:'🌧️', Drizzle:'🌦️',
  Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Fog:'🌫️', Haze:'🌫️',
}

const WEATHER_GRADIENT: Record<string, string> = {
  Clear:        'linear-gradient(135deg,#1a3a6b,#2563ab)',
  Clouds:       'linear-gradient(135deg,#1e293b,#334155)',
  Rain:         'linear-gradient(135deg,#0f2027,#2c5364)',
  Drizzle:      'linear-gradient(135deg,#1a2a3a,#1e3a5f)',
  Thunderstorm: 'linear-gradient(135deg,#0a0a0a,#16213e)',
  Snow:         'linear-gradient(135deg,#1a2540,#1e3050)',
  Mist:         'linear-gradient(135deg,#1e2432,#1a2333)',
}

function SidebarWeather() {
  const [data,    setData]    = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [city,    setCity]    = useState('Dakar')
  const [editing, setEditing] = useState(false)
  const [input,   setInput]   = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async (c: string) => {
    setLoading(true); setError(false)
    try { setData(await fetchCurrentWeather(c)) }
    catch { setError(true) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load(city) }, [city, load])

  const confirm = () => {
    const v = input.trim()
    if (v) { setCity(v); setInput(''); setEditing(false) }
  }

  const openEdit = () => {
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 60)
  }

  const bg = data ? (WEATHER_GRADIENT[data.condition] ?? 'linear-gradient(135deg,#0d1426,#1a2540)') : 'var(--s2)'

  return (
    <div style={{ padding:'0 12px 12px' }}>
      <div style={{ borderTop:'1px solid var(--l1)', paddingTop:12, marginBottom:0 }}>
        <p style={{ fontSize:10.5, fontWeight:700, color:'var(--t4)', textTransform:'uppercase', letterSpacing:'1.2px', padding:'0 4px', marginBottom:8 }}>
          Météo
        </p>
      </div>

      <div style={{
        borderRadius:16, overflow:'hidden', position:'relative',
        background: bg,
        border:'1px solid rgba(255,255,255,.07)',
        boxShadow:'0 4px 24px rgba(0,0,0,.4)',
        transition:'background .6s ease',
      }}>
        {/* Halo décoratif */}
        <div style={{
          position:'absolute', top:-20, right:-20,
          width:100, height:100, borderRadius:'50%',
          background:'rgba(255,255,255,.04)',
          pointerEvents:'none',
        }} />

        {/* ── Chargement ── */}
        {loading && !data && (
          <div style={{ padding:'20px 16px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:28, height:28, borderRadius:8,
              background:'rgba(255,255,255,.06)',
            }} />
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ height:10, borderRadius:4, background:'rgba(255,255,255,.06)', width:'60%' }} />
              <div style={{ height:8,  borderRadius:4, background:'rgba(255,255,255,.04)', width:'40%' }} />
            </div>
          </div>
        )}

        {/* ── Erreur ── */}
        {error && !loading && (
          <div style={{ padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:6 }}>⚠️</div>
            <p style={{ fontSize:11, color:'var(--red)', marginBottom:8 }}>Ville introuvable</p>
            <button onClick={openEdit} style={{
              fontSize:11, color:'rgba(255,255,255,.5)', background:'rgba(255,255,255,.06)',
              border:'1px solid rgba(255,255,255,.08)', borderRadius:6, padding:'5px 10px',
              cursor:'pointer', fontFamily:'Outfit,sans-serif',
            }}>Changer de ville</button>
          </div>
        )}

        {/* ── Données météo ── */}
        {data && !loading && (
          <div style={{ padding:'14px 16px 12px' }}>

            {/* Ville + refresh */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <button onClick={openEdit} style={{
                display:'flex', alignItems:'center', gap:5,
                background:'none', border:'none', cursor:'pointer',
                color:'rgba(255,255,255,.65)', fontSize:11.5, fontFamily:'Outfit,sans-serif',
                padding:0, fontWeight:500,
              }}>
                <svg width={10} height={10} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {data.city}, {data.country}
              </button>
              <button onClick={() => load(city)} style={{
                background:'rgba(255,255,255,.08)', border:'none', borderRadius:6,
                width:22, height:22, cursor:'pointer', display:'flex', alignItems:'center',
                justifyContent:'center', color:'rgba(255,255,255,.5)',
                transition:'all .15s',
              }}
                onMouseOver={e => (e.currentTarget.style.background='rgba(255,255,255,.14)')}
                onMouseOut={e  => (e.currentTarget.style.background='rgba(255,255,255,.08)')}
              >
                <svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                  style={{ animation: loading ? 'spin .8s linear infinite' : 'none' }}>
                  <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
              </button>
            </div>

            {/* Température + emoji */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:32, lineHeight:1 }}>{WEATHER_EMOJI[data.condition] ?? '🌡️'}</span>
              <div>
                <div style={{ fontSize:30, fontWeight:800, color:'#fff', lineHeight:1, letterSpacing:'-1px' }}>
                  {data.temperature}°<span style={{ fontSize:16, fontWeight:500, opacity:.6 }}>C</span>
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginTop:2, textTransform:'capitalize' }}>
                  {data.description}
                </div>
              </div>
            </div>

            {/* Métriques inline */}
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr',
              gap:6, marginTop:10,
            }}>
              {[
                { icon:'💧', val:`${data.humidity}%`,       lbl:'Humidité' },
                { icon:'💨', val:`${data.windSpeed} km/h`,  lbl:'Vent' },
              ].map(m => (
                <div key={m.lbl} style={{
                  background:'rgba(0,0,0,.2)',
                  borderRadius:10, padding:'8px 10px',
                  border:'1px solid rgba(255,255,255,.06)',
                }}>
                  <div style={{ fontSize:14, marginBottom:2 }}>{m.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.9)' }}>{m.val}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', marginTop:1 }}>{m.lbl}</div>
                </div>
              ))}
            </div>

            {/* Ressenti */}
            <div style={{
              marginTop:8, padding:'6px 10px',
              background:'rgba(255,255,255,.05)', borderRadius:8,
              fontSize:11, color:'rgba(255,255,255,.45)',
              display:'flex', justifyContent:'space-between',
            }}>
              <span>Ressenti {data.feelsLike}°C</span>
              <span>🌅 {new Date(data.sunrise*1000).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
            </div>
          </div>
        )}

        {/* ── Recherche de ville ── */}
        {editing && (
          <div style={{
            position:'absolute', inset:0,
            background:'rgba(5,10,25,.95)',
            backdropFilter:'blur(12px)',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            padding:'16px', gap:8, borderRadius:16,
            zIndex:10,
          }} className="fx-in">
            <p style={{ fontSize:12, color:'rgba(255,255,255,.5)', marginBottom:4 }}>Choisir une ville</p>
            <div style={{ display:'flex', gap:6, width:'100%' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter') confirm(); if (e.key==='Escape') setEditing(false) }}
                placeholder="Paris, Tokyo…"
                style={{
                  flex:1, background:'rgba(255,255,255,.08)',
                  border:'1px solid rgba(255,255,255,.12)', borderRadius:8,
                  color:'#fff', fontSize:13, padding:'8px 12px',
                  fontFamily:'Outfit,sans-serif', outline:'none',
                }}
              />
              <button onClick={confirm} style={{
                background:'linear-gradient(135deg,#6b7fff,#5c5ef4)',
                border:'none', borderRadius:8, width:34, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff',
              }}>
                <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
            <button onClick={() => setEditing(false)} style={{
              fontSize:11, color:'rgba(255,255,255,.3)',
              background:'none', border:'none', cursor:'pointer',
              fontFamily:'Outfit,sans-serif',
            }}>Annuler</button>
          </div>
        )}
      </div>
    </div>
  )
}
