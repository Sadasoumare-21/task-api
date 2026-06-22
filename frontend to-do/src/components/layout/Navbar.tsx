import { Link, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/TaskContext'
import Button from '../ui/Button'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useTaskContext()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)]" style={{ background:'rgba(11,11,22,.88)', backdropFilter:'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-lg text-[var(--text-1)] tracking-tight">Task<span className="gradient-text">Flow</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/"          className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Accueil</Link>
          {isAuthenticated && <Link to="/dashboard" className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Dashboard</Link>}
          <Link to="/guide"     className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Guide</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-2)]">
                <div className="w-7 h-7 rounded-full btn-primary flex items-center justify-center text-white text-xs font-bold">{user?.name.charAt(0).toUpperCase()}</div>
                <span>{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Deconnexion</Button>
            </>
          ) : (
            <>
              <Button variant="ghost"   size="sm" onClick={() => navigate('/login')}>Connexion</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>S'inscrire</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
