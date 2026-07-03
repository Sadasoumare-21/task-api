import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Task, TaskFilters, User, TaskCategory } from '../types'
import { TaskService } from '../services/task.service'
import { CategoryService } from '../services/category.service'
import api from '../services/api'
import { useTaskReminders } from '../hooks/useTaskReminders'

// ─── Métadonnées locales (priority, dueDate, dueTime) ────────────────────────
const categoryMap = {
  nameToId: {} as Record<string, number>,
  idToName: {} as Record<number, string>,
}

interface TaskMetadata {
  priority: 'normal' | 'urgent'
  dueDate: string
  dueTime: string
}

function getTaskMetadata(id: string): TaskMetadata {
  try {
    const metaStr = localStorage.getItem(`task_meta_${id}`)
    if (metaStr) return JSON.parse(metaStr)
  } catch (e) {
    console.error('Erreur lecture metadata', e)
  }
  const today = new Date().toISOString().slice(0, 10)
  const nowTime = new Date().toTimeString().slice(0, 5)
  return { priority: 'normal', dueDate: today, dueTime: nowTime }
}

function saveTaskMetadata(id: string, meta: Partial<TaskMetadata>) {
  try {
    const updated = { ...getTaskMetadata(id), ...meta }
    localStorage.setItem(`task_meta_${id}`, JSON.stringify(updated))
  } catch (e) {
    console.error('Erreur sauvegarde metadata', e)
  }
}

function removeTaskMetadata(id: string) {
  localStorage.removeItem(`task_meta_${id}`)
}

/** 🟢 CORRECTION : Déduction de la catégorie si l'objet imbriqué n'est pas fourni */
function mapBackendTaskToFrontend(bt: any): Task {
  const meta = getTaskMetadata(String(bt.id))
  
  let categoryName = 'Travail'
  if (bt.category?.name) {
    categoryName = bt.category.name
  } else {
    const catId = bt.categoryId || bt.category?.id
    if (catId && categoryMap.idToName[catId]) {
      categoryName = categoryMap.idToName[catId]
    }
  }

  const category = categoryName as TaskCategory

  return {
    id: String(bt.id),
    name: bt.title,
    description: bt.description || '',
    category,
    status: bt.status === 'COMPLETED' || bt.status === 'done' ? 'done' : 'pending',
    priority: meta.priority,
    dueDate: meta.dueDate,
    dueTime: meta.dueTime,
    createdAt: bt.createdAt || new Date().toISOString(),
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
interface State {
  tasks: Task[]
  filters: TaskFilters
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  // 🔐 true tant que la restauration de session initiale n'est pas terminée
  authLoading: boolean
}

type Action =
  | { type: 'SET_TASKS';       payload: Task[] }
  | { type: 'ADD_TASK';        payload: Task }
  | { type: 'UPDATE_TASK';     payload: Task }
  | { type: 'DELETE_TASK';     payload: string }
  | { type: 'SET_FILTERS';     payload: Partial<TaskFilters> }
  | { type: 'LOGIN';           payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING';     payload: boolean }
  | { type: 'SET_AUTH_LOADING'; payload: boolean }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'SET_TASKS':        return { ...s, tasks: a.payload, loading: false }
    case 'ADD_TASK':         return { ...s, tasks: [a.payload, ...s.tasks] }
    case 'UPDATE_TASK':      return { ...s, tasks: s.tasks.map(t => t.id === a.payload.id ? a.payload : t) }
    case 'DELETE_TASK':      return { ...s, tasks: s.tasks.filter(t => t.id !== a.payload) }
    case 'SET_FILTERS':      return { ...s, filters: { ...s.filters, ...a.payload } }
    case 'LOGIN':            return { ...s, user: a.payload, isAuthenticated: true }
    case 'LOGOUT':           return { ...s, user: null, isAuthenticated: false, tasks: [], loading: false, authLoading: false }
    case 'SET_LOADING':      return { ...s, loading: a.payload }
    case 'SET_AUTH_LOADING': return { ...s, authLoading: a.payload }
    default:                 return s
  }
}

const INIT: State = {
  tasks: [],
  filters: { status: 'all', category: 'all', search: '', sort: 'dueDate' },
  user: null,
  isAuthenticated: false,
  loading: false,
  // 🔐 Démarre à true — sera mis à false dès la fin de la restauration de session
  authLoading: true,
}

interface Ctx extends State {
  addTask:    (d: Omit<Task, 'id' | 'createdAt'>) => Promise<void>
  updateTask: (t: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  setFilters: (f: Partial<TaskFilters>) => void
  login:      (u: User) => void
  logout:     () => void
  // 🔐 true pendant la restauration de session initiale
  authLoading: boolean
}

const Ctx = createContext<Ctx | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INIT)

  // ── Rappels automatiques avant échéance ───────────────────────────────────
  useTaskReminders(state.tasks)

  // 🔐 Restauration de session au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      // Pas de token : on termine l'init immédiatement
      dispatch({ type: 'SET_AUTH_LOADING', payload: false })
      return
    }

    try {
      const payloadBase64 = token.split('.')[1]
      const payload = JSON.parse(atob(payloadBase64)) as {
        sub: number
        email: string
        exp: number
      }

      const isExpired = payload.exp * 1000 < Date.now()
      if (isExpired) {
        // Token expiré côté client : nettoyage immédiat
        localStorage.removeItem('token')
        dispatch({ type: 'SET_AUTH_LOADING', payload: false })
        return
      }

      const restoredUser: User = {
        id: String(payload.sub),
        email: payload.email,
        name: payload.email.split('@')[0],
      }

      dispatch({ type: 'LOGIN', payload: restoredUser })
    } catch {
      // Token malformé : nettoyage
      localStorage.removeItem('token')
    } finally {
      // Dans tous les cas, l'init est terminée
      dispatch({ type: 'SET_AUTH_LOADING', payload: false })
    }
  }, [])

  // 🔐 Intercepteur 401 : déconnexion automatique + redirect (hors routes d'auth)
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const requestUrl: string = error.config?.url ?? ''
          // Éviter la boucle infinie si le 401 vient des routes d'authentification
          const isAuthRoute = requestUrl.includes('/auth/login') ||
                              requestUrl.includes('/auth/register')

          if (!isAuthRoute) {
            localStorage.removeItem('token')
            dispatch({ type: 'LOGOUT' })
            // Redirection propre hors de React pour éviter les conflits de routeur
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      },
    )
    return () => api.interceptors.response.eject(interceptorId)
  }, [])

  useEffect(() => {
    if (!state.isAuthenticated) return

    const fetchTasks = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        try {
          const existing = await CategoryService.getAll()
          const required = ['Travail', 'Personnel', 'Sante', 'Apprentissage', 'Finance']

          for (const catName of required) {
            const found = existing.find(c => c.name.toLowerCase() === catName.toLowerCase())
            if (!found) {
              try {
                const newCat = await CategoryService.create(catName)
                existing.push(newCat)
              } catch (e) {
                console.error(`Erreur création catégorie ${catName}`, e)
              }
            }
          }

          existing.forEach(c => {
            categoryMap.nameToId[c.name] = c.id
            categoryMap.idToName[c.id] = c.name
          })
        } catch (e) {
          console.error('Erreur synchronisation catégories', e)
        }

        const data = await TaskService.getAll()
        dispatch({ type: 'SET_TASKS', payload: data.map(mapBackendTaskToFrontend) })
      } catch (err) {
        console.error('Erreur récupération des tâches', err)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    fetchTasks()
  }, [state.isAuthenticated])

  // ─── Actions ──────────────────────────────────────────────────────────────

  const addTask = useCallback(async (d: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const categoryId = categoryMap.nameToId[d.category] || undefined
      const createdTask = await TaskService.create({
        title: d.name,
        description: d.description,
        categoryId,
      })

      // Injection explicite de la categoryId si absente de la réponse brute pour sécuriser le mapping
      if (!createdTask.categoryId && categoryId) {
        createdTask.categoryId = categoryId;
      }

      saveTaskMetadata(String(createdTask.id), {
        priority: d.priority,
        dueDate: d.dueDate,
        dueTime: d.dueTime,
      })

      dispatch({ type: 'ADD_TASK', payload: mapBackendTaskToFrontend(createdTask) })
    } catch (err) {
      console.error('Erreur création tâche', err)
      throw err
    }
  }, [])

  const updateTask = useCallback(async (t: Task) => {
    try {
      const categoryId = categoryMap.nameToId[t.category] || undefined
      const updated = await TaskService.update(t.id, {
        title: t.name,
        description: t.description,
        categoryId,
        status: t.status === 'done' ? 'COMPLETED' : 'PENDING',
      })

      if (!updated.categoryId && categoryId) {
        updated.categoryId = categoryId;
      }

      saveTaskMetadata(t.id, {
        priority: t.priority,
        dueDate: t.dueDate,
        dueTime: t.dueTime,
      })

      dispatch({ type: 'UPDATE_TASK', payload: mapBackendTaskToFrontend(updated) })
    } catch (err) {
      console.error('Erreur mise à jour tâche', err)
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      await TaskService.delete(id)
      removeTaskMetadata(id)
      dispatch({ type: 'DELETE_TASK', payload: id })
    } catch (err) {
      console.error('Erreur suppression tâche', err)
      throw err
    }
  }, [])

  const toggleTask = useCallback(async (id: string) => {
    try {
      const task = state.tasks.find(t => t.id === id)
      if (!task) return
      const nextStatus = task.status === 'done' ? 'PENDING' : 'COMPLETED'
      const updated = await TaskService.update(task.id, { status: nextStatus })
      dispatch({ type: 'UPDATE_TASK', payload: mapBackendTaskToFrontend(updated) })
    } catch (err) {
      console.error('Erreur basculement statut', err)
    }
  }, [state.tasks])

  const setFilters = useCallback(
    (f: Partial<TaskFilters>) => dispatch({ type: 'SET_FILTERS', payload: f }),
    [],
  )

  const login = useCallback((u: User) => {
    dispatch({ type: 'LOGIN', payload: u })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }, [])

  return (
    <Ctx.Provider
      value={{
        ...state,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        setFilters,
        login,
        logout,
        authLoading: state.authLoading,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useTaskContext(): Ctx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useTaskContext doit être utilisé à l\'intérieur de TaskProvider')
  return c
}