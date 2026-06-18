import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/TaskContext'

function InputField({ label, type='text', icon, placeholder, value, onChange, error, extra }:
  { label:string; type?:string; icon:string; placeholder:string; value:string; onChange:(v:string)=>void; error?:string; extra?:React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <label style={{ fontSize:13.5, fontWeight:600, color:'var(--t2)', letterSpacing:'-.01em' }}>{label}</label>
        {extra}
      </div>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'var(--t3)', pointerEvents:'none' }}>{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className="field field-icon" style={{ paddingLeft:44 }}
          onFocus={e => { e.currentTarget.style.borderColor='rgba(91,115,245,.7)'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(91,115,245,.12)' }}
          onBlur={e  => { e.currentTarget.style.borderColor='var(--line-2)'; e.currentTarget.style.boxShadow='none' }}/>
      </div>
      {error && <p style={{ fontSize:12, color:'var(--red)', fontWeight:500 }}>{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  const nav = useNavigate()
  const { login } = useTaskContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string,string> = {}
    if (!email.trim()) e.email = 'Email requis'
    if (!password) e.password = 'Mot de passe requis'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); if (!validate()) return
    setLoading(true); await new Promise(r => setTimeout(r, 700))
    login({ id:'1', name: email.split('@')[0], email }); nav('/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', background:'var(--canvas)' }}>
      {/* LEFT */}
      <div style={{ background:'var(--surface-0)', borderRight:'1px solid var(--line-1)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'40%', left:-80, width:320, height:320, background:'radial-gradient(circle,rgba(91,115,245,.07) 0%,transparent 60%)', pointerEvents:'none', borderRadius:'50%' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(145deg,#6b7fff,#5b5ef4)', boxShadow:'0 4px 16px rgba(91,115,245,.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width={18} height={18} fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <span style={{ fontSize:17, fontWeight:700, color:'var(--t1)', letterSpacing:'-.03em' }}>TaskFlow</span>
        </div>
        <div style={{ position:'relative' }}>
          <h2 style={{ fontSize:42, fontWeight:900, lineHeight:1.1, letterSpacing:'-2px', color:'var(--t1)', marginBottom:20 }}>
            Bon retour<br/>parmi nous !
          </h2>
          <p style={{ fontSize:16, color:'var(--t2)', lineHeight:1.7, fontWeight:400 }}>
            Connectez-vous pour reprendre la ou vous en etiez et continuer a progresser vers vos objectifs.
          </p>
        </div>
        <p style={{ fontSize:13, color:'var(--t4)', position:'relative' }}>© 2026 TaskFlow. Tous droits reserves.</p>
      </div>

      {/* RIGHT */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 48px' }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <div style={{ marginBottom:48 }}>
            <h1 style={{ fontSize:38, fontWeight:900, letterSpacing:'-2px', color:'var(--t1)', marginBottom:8 }}>
              Se connecter 👋
            </h1>
            <p style={{ fontSize:16, color:'var(--t2)', fontWeight:400 }}>Acces a votre espace TaskFlow</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <InputField label="Adresse email" icon="📧" type="email" placeholder="vous@exemple.com"
                        value={email} onChange={setEmail} error={errors.email}/>
            <InputField label="Mot de passe"  icon="🔒" type="password" placeholder="Votre mot de passe"
                        value={password} onChange={setPassword} error={errors.password}
                        extra={<Link to="/reset-password" style={{ fontSize:12.5, color:'var(--blue-light)', fontWeight:600, textDecoration:'none' }}>Mot de passe oublie ?</Link>}/>
            <div style={{ marginTop:8 }}>
              <button type="submit" disabled={loading} className="btn btn-hero" style={{ width:'100%', justifyContent:'center' }}>
                {loading
                  ? <><span style={{ width:18, height:18, border:'2.5px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin-slow .7s linear infinite' }}/> Connexion...</>
                  : 'Se connecter →'}
              </button>
            </div>
          </form>

          <div style={{ marginTop:20, padding:'14px 18px', borderRadius:14, background:'rgba(91,115,245,.06)', border:'1px solid rgba(91,115,245,.14)', textAlign:'center' }}>
            <p style={{ fontSize:13, color:'var(--t3)' }}>💡 Demo : entrez n'importe quel email + mot de passe</p>
          </div>

          <div style={{ textAlign:'center', marginTop:24 }}>
            <span style={{ fontSize:14.5, color:'var(--t2)' }}>Pas de compte ? </span>
            <Link to="/register" style={{ fontSize:14.5, color:'var(--blue-light)', fontWeight:700, textDecoration:'none' }}>S'inscrire gratuitement</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
