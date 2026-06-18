import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/TaskContext'

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(145deg,#6b7fff,#5b5ef4)', boxShadow:'0 4px 16px rgba(91,115,245,.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width={18} height={18} fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
      </div>
      <span style={{ fontSize:17, fontWeight:700, color:'var(--t1)', letterSpacing:'-.03em' }}>TaskFlow</span>
    </div>
  )
}

function InputField({ label, type='text', icon, placeholder, value, onChange, error }:
  { label:string; type?:string; icon:string; placeholder:string; value:string; onChange:(v:string)=>void; error?:string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <label style={{ fontSize:13.5, fontWeight:600, color:'var(--t2)', letterSpacing:'-.01em' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'var(--t3)', pointerEvents:'none' }}>{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className="field field-icon"
          style={{ paddingLeft:44 }}
          onFocus={e => { e.currentTarget.style.borderColor='rgba(91,115,245,.7)'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(91,115,245,.12)' }}
          onBlur={e  => { e.currentTarget.style.borderColor='var(--line-2)'; e.currentTarget.style.boxShadow='none' }}/>
      </div>
      {error && <p style={{ fontSize:12, color:'var(--red)', fontWeight:500 }}>{error}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const nav = useNavigate()
  const { login } = useTaskContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string,string> = {}
    if (!name.trim()) e.name = 'Champ requis'
    if (!email.trim()) e.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide'
    if (password.length < 8) e.password = 'Minimum 8 caracteres'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); if (!validate()) return
    setLoading(true); await new Promise(r => setTimeout(r, 800))
    login({ id: crypto.randomUUID(), name: name.trim(), email }); nav('/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', background:'var(--canvas)' }}>

      {/* ── LEFT PANEL ──────────────────────────────────────────────── */}
      <div style={{ background:'var(--surface-0)', borderRight:'1px solid var(--line-1)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 56px', position:'relative', overflow:'hidden' }}>
        {/* Glow */}
        <div style={{ position:'absolute', bottom:-100, left:-100, width:400, height:400, background:'radial-gradient(circle,rgba(91,115,245,.08) 0%,transparent 60%)', pointerEvents:'none', borderRadius:'50%' }}/>
        <Logo />
        <div style={{ position:'relative' }}>
          <h2 style={{ fontSize:42, fontWeight:900, lineHeight:1.1, letterSpacing:'-2px', color:'var(--t1)', marginBottom:32 }}>
            Organisez votre<br/>quotidien avec{' '}
            <span className="grad">clarte</span>
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {['Gerez vos taches par categorie et priorite','Suivez votre productivite avec des statistiques','Rappels intelligents pour ne rien oublier'].map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:24, height:24, borderRadius:8, background:'rgba(91,115,245,.15)', border:'1px solid rgba(91,115,245,.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width={12} height={12} fill="none" stroke="#7b8fff" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span style={{ fontSize:14.5, color:'var(--t2)', fontWeight:400 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize:13, color:'var(--t4)', position:'relative' }}>© 2026 TaskFlow. Tous droits reserves.</p>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 48px' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <div style={{ marginBottom:48 }}>
            <h1 style={{ fontSize:38, fontWeight:900, letterSpacing:'-2px', color:'var(--t1)', marginBottom:8 }}>
              Creer un compte ✨
            </h1>
            <p style={{ fontSize:16, color:'var(--t2)', fontWeight:400 }}>Commencez a organiser votre vie des aujourd'hui</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <InputField label="Nom complet"    icon="👤" placeholder="Jean Dupont"       value={name}     onChange={setName}     error={errors.name}/>
            <InputField label="Adresse email"  icon="📧" type="email" placeholder="vous@exemple.com" value={email} onChange={setEmail} error={errors.email}/>
            <InputField label="Mot de passe"   icon="🔒" type="password" placeholder="Minimum 8 caracteres" value={password} onChange={setPassword} error={errors.password}/>

            <div style={{ marginTop:8 }}>
              <button type="submit" disabled={loading} className="btn btn-hero"
                style={{ width:'100%', justifyContent:'center' }}>
                {loading
                  ? <><span style={{ width:18, height:18, border:'2.5px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin-slow .7s linear infinite' }}/> Creation en cours...</>
                  : 'Creer mon compte →'}
              </button>
            </div>
          </form>

          <p style={{ fontSize:12, textAlign:'center', marginTop:20, color:'var(--t3)', lineHeight:1.7 }}>
            En creant un compte, vous acceptez nos{' '}
            <span style={{ color:'var(--blue-light)', fontWeight:600, cursor:'pointer' }}>CGU</span>{' '}et notre{' '}
            <span style={{ color:'var(--blue-light)', fontWeight:600, cursor:'pointer' }}>politique de confidentialite</span>.
          </p>

          <div style={{ textAlign:'center', marginTop:24 }}>
            <span style={{ fontSize:14.5, color:'var(--t2)' }}>Deja un compte ? </span>
            <Link to="/login" style={{ fontSize:14.5, color:'var(--blue-light)', fontWeight:700, textDecoration:'none' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
