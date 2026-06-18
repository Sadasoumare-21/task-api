import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext'
import LandingPage       from './pages/LandingPage'
import LoginPage         from './pages/auth/LoginPage'
import RegisterPage      from './pages/auth/RegisterPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import DashboardLayout   from './pages/dashboard/DashboardLayout'
import DashboardPage     from './pages/dashboard/DashboardPage'
import StatsPage         from './pages/dashboard/StatsPage'

/**
 * App.tsx — Composant racine.
 * Utilise BrowserRouter, Routes, Route (React Router DOM).
 * TaskProvider encapsule toute l'application (Context + useReducer).
 */
export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ──────────────────────────────────────────────── */}
          <Route path="/"               element={<LandingPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ── Dashboard (protected — redirect si non authentifié) ── */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index         element={<DashboardPage />} />
            <Route path="stats"  element={<StatsPage />} />
          </Route>

          {/* ── Fallback ─────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  )
}
