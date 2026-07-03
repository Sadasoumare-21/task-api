import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// 🔖 Déclaration TypeScript pour la variable injectée par Vite au build
declare const __BUILD_TIME__: string

// 🔄 Détection de nouvelle version : force un rechargement si le bundle a changé
const BUILD_KEY = 'app_build_time'
const storedBuild = localStorage.getItem(BUILD_KEY)

if (storedBuild && storedBuild !== __BUILD_TIME__) {
  // Nouvelle version détectée : nettoyer le cache localStorage (tokens obsolètes inclus)
  // Sauf le flag de rechargement pour éviter une boucle infinie
  const reloaded = sessionStorage.getItem('reloaded')
  if (!reloaded) {
    sessionStorage.setItem('reloaded', '1')
    localStorage.clear()
    localStorage.setItem(BUILD_KEY, __BUILD_TIME__)
    window.location.reload()
  }
} else {
  // Première visite ou même version : enregistrer le build actuel
  localStorage.setItem(BUILD_KEY, __BUILD_TIME__)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)