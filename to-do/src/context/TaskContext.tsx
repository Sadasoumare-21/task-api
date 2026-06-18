import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { Task, TaskFilters, User } from '../types'

interface State {
  tasks: Task[]
  filters: TaskFilters
  user: User | null
  isAuthenticated: boolean
}

type Action =
  | { type: 'ADD_TASK';    payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'LOGIN';       payload: User }
  | { type: 'LOGOUT' }

const today = new Date().toISOString().slice(0, 10)

const SEED: Task[] = [
  { id:'1', name:'Finaliser le rapport Q1',      description:'Rapport trimestriel complet.', category:'Travail',       status:'pending', priority:'normal', dueDate: today,         dueTime:'09:00', createdAt: new Date(Date.now()-86400000*2).toISOString() },
  { id:'2', name:'Seance de sport - cardio 30min',description:'30 min cardio + etirements.', category:'Sante',         status:'done',    priority:'normal', dueDate: today,         dueTime:'07:00', createdAt: new Date(Date.now()-86400000*4).toISOString() },
  { id:'3', name:'Lire chapitre 4 de Clean Code', description:'Fonctions et commentaires.',   category:'Apprentissage', status:'pending', priority:'normal', dueDate:'2026-03-14',   dueTime:'20:00', createdAt: new Date(Date.now()-86400000*3).toISOString() },
  { id:'4', name:'Virer loyer Mars',              description:'Virement bancaire urgent.',    category:'Finance',       status:'pending', priority:'urgent', dueDate:'2026-03-15',   dueTime:'10:00', createdAt: new Date(Date.now()-86400000).toISOString() },
  { id:'5', name:'Appeler maman',                 description:'',                            category:'Personnel',     status:'pending', priority:'normal', dueDate: today,         dueTime:'18:00', createdAt: new Date().toISOString() },
  { id:'6', name:'Reunion equipe produit',         description:'Sprint review + planning.',   category:'Travail',       status:'done',    priority:'urgent', dueDate:'2026-03-12',   dueTime:'14:30', createdAt: new Date(Date.now()-86400000*5).toISOString() },
]

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'ADD_TASK':    return { ...s, tasks: [a.payload, ...s.tasks] }
    case 'UPDATE_TASK': return { ...s, tasks: s.tasks.map(t => t.id === a.payload.id ? a.payload : t) }
    case 'DELETE_TASK': return { ...s, tasks: s.tasks.filter(t => t.id !== a.payload) }
    case 'TOGGLE_TASK': return { ...s, tasks: s.tasks.map(t => t.id === a.payload ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t) }
    case 'SET_FILTERS': return { ...s, filters: { ...s.filters, ...a.payload } }
    case 'LOGIN':       return { ...s, user: a.payload, isAuthenticated: true }
    case 'LOGOUT':      return { ...s, user: null, isAuthenticated: false }
    default:            return s
  }
}

const INIT: State = {
  tasks: SEED,
  filters: { status: 'all', category: 'all', search: '', sort: 'dueDate' },
  user: null,
  isAuthenticated: false,
}

interface Ctx extends State {
  addTask:    (d: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (t: Task) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  setFilters: (f: Partial<TaskFilters>) => void
  login:      (u: User) => void
  logout:     () => void
}

const Ctx = createContext<Ctx | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INIT)
  const addTask    = useCallback((d: Omit<Task,'id'|'createdAt'>) =>
    dispatch({ type:'ADD_TASK', payload: { ...d, id: crypto.randomUUID(), createdAt: new Date().toISOString() } }), [])
  const updateTask = useCallback((t: Task)    => dispatch({ type:'UPDATE_TASK', payload: t }), [])
  const deleteTask = useCallback((id: string) => dispatch({ type:'DELETE_TASK', payload: id }), [])
  const toggleTask = useCallback((id: string) => dispatch({ type:'TOGGLE_TASK', payload: id }), [])
  const setFilters = useCallback((f: Partial<TaskFilters>) => dispatch({ type:'SET_FILTERS', payload: f }), [])
  const login      = useCallback((u: User)    => dispatch({ type:'LOGIN', payload: u }), [])
  const logout     = useCallback(()           => dispatch({ type:'LOGOUT' }), [])
  return <Ctx.Provider value={{ ...state, addTask, updateTask, deleteTask, toggleTask, setFilters, login, logout }}>{children}</Ctx.Provider>
}

export function useTaskContext(): Ctx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useTaskContext must be inside TaskProvider')
  return c
}
