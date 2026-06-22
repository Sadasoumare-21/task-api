# TaskFlow — Application de gestion de tâches personnelles

> React 19 · TypeScript 5 · Tailwind CSS 4 · React Router DOM 7

## Lancer le projet

```bash
npm install
npm run dev
# → http://localhost:5173
```

**Connexion démo** : n'importe quel email + mot de passe (ex: `test@test.com` / `12345678`)

## Structure

```
to-do/
├── vite.config.ts              ← Tailwind installé ici (@tailwindcss/vite)
├── src/
│   ├── main.tsx                ← Point d'entrée
│   ├── App.tsx                 ← BrowserRouter + Routes + Route
│   ├── index.css               ← @import "tailwindcss"
│   ├── types/index.ts          ← Types & Props interfaces
│   ├── context/TaskContext.tsx ← État global (useReducer + Context)
│   ├── hooks/useTasks.ts       ← Filtres, stats, tâches du jour
│   ├── components/
│   │   ├── ui/                 ← Modal, GuideTable (props: title, headers, data)
│   │   ├── layout/             ← Sidebar (NavLink, useNavigate)
│   │   └── tasks/              ← TaskRow, TaskDetail, TaskForm, StatCard (props)
│   └── pages/
│       ├── LandingPage.tsx     ← Page d'accueil
│       ├── auth/               ← Login, Register, ResetPassword
│       └── dashboard/          ← Layout (Outlet), DashboardPage, StatsPage
```

## Routes
| Route | Page | Accès |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/reset-password` | Réinitialisation | Public |
| `/dashboard` | Mes tâches | Protégé |
| `/dashboard/stats` | Statistiques | Protégé |
