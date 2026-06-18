import { useState } from 'react'
import { Link } from 'react-router-dom'

const inputCls = `w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-colors`
const inputSty = { background:'#131d2e', border:'1px solid #243147', color:'#f1f5f9' }

export default function ResetPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Email invalide'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false); setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background:'var(--bg-base)' }}>
      <div className="card w-full max-w-md p-10 anim-fadeUp">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{sent ? '📬' : '🔑'}</div>
          <h1 className="text-2xl font-black mb-2" style={{ color:'var(--text-1)', fontFamily:'Inter,sans-serif' }}>
            {sent ? 'Email envoye !' : 'Mot de passe oublie ?'}
          </h1>
          <p className="text-sm" style={{ color:'var(--text-2)' }}>
            {sent ? `Lien envoye a ${email}` : 'Saisissez votre email pour recevoir un lien de reinitialisation.'}
          </p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color:'var(--text-3)' }}>📧</span>
              <input type="email" className={inputCls} style={{ ...inputSty, paddingLeft:40 }} placeholder="vous@exemple.com"
                     value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {error && <p className="text-xs" style={{ color:'var(--red)' }}>{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-blue w-full py-4 text-base font-bold rounded-2xl disabled:opacity-60">
              {loading ? <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Envoyer le lien'}
            </button>
          </form>
        ) : (
          <button onClick={() => setSent(false)} className="btn btn-outline w-full py-4 text-base font-semibold rounded-2xl">Renvoyer</button>
        )}
        <p className="text-sm text-center mt-6">
          <Link to="/login" style={{ color:'var(--primary)' }}>← Retour connexion</Link>
        </p>
      </div>
    </div>
  )
}
