import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { Task, TaskFilters, User } from '../types'
import { TaskService } from '../services/task.service'

interface State {
  tasks: Task[]
  filters: TaskFilters
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

type Action =
  | { type: 'SET_TASKS';    payload: Task[] }
  | { type: 'ADD_TASK';    payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'LOGIN';       payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'SET_TASKS':   return { ...s, tasks: a.payload, loading: false }
    case 'ADD_TASK':    return { ...s, tasks: [a.payload, ...s.tasks] }
    case 'UPDATE_TASK': return { ...s, tasks: s.tasks.map(t => t.id === a.payload.id ? a.payload : t) }
    case 'DELETE_TASK': return { ...s, tasks: s.tasks.filter(t => t.id !== a.payload) }
    case 'SET_FILTERS': return { ...s, filters: { ...s.filters, ...a.payload } }
    case 'LOGIN':       return { ...s, user: a.payload, isAuthenticated: true }
    case 'LOGOUT':      return { ...s, user: null, isAuthenticated: false, tasks: [] }
    case 'SET_LOADING': return { ...s, loading: a.payload }
    default:            return s
  }
}

const INIT: State = {
  tasks: [],
  filters: { status: 'all', category: 'all', search: '', sort: 'dueDate' },
  user: null,
  isAuthenticated: false,
  loading: false,
}

interface Ctx extends State {
  addTask:    (d: Omit<Task, 'id' | 'createdAt'>) => Promise<void>
  updateTask: (t: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (task: Task) => Promise<void>
  setFilters: (f: Partial<TaskFilters>) => void
  login:      (u: User) => void
  logout:     () => void
}

const Ctx = createContext<Ctx | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INIT)

  // Chargement des tâches depuis le backend NestJS à la connexion
  useEffect(() => {
    if (state.isAuthenticated) {
      const fetchTasks = async () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
          const data = await TaskService.getAll()
          dispatch({ type: 'SET_TASKS', payload: data })
        } catch (err) {
          console.error("Erreur lors de la récupération des tâches", err)
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
      fetchTasks()
    }
  }, [state.isAuthenticated])

  const addTask = useCallback(async (d: Omit<Task,'id'|'createdAt'>) => {
    try {
      const newTask = await TaskService.create(d)
      dispatch({ type: 'ADD_TASK', payload: newTask })
    } catch (err) {
      console.error("Erreur création tâche", err)
    }
  }, [])

  const updateTask = useCallback(async (t: Task) => {
    try {
      const updatedTask = await TaskService.update(t.id, t)
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask })
    } catch (err) {
      console.error("Erreur mise à jour tâche", err)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      await TaskService.delete(id)
      dispatch({ type: 'DELETE_TASK', payload: id })
    } catch (err) {
      console.error("Erreur suppression tâche", err)
    }
  }, [])

  const toggleTask = useCallback(async (task: Task) => {
    try {
      const nextStatus = task.status === 'done' ? 'pending' : 'done'
      const updatedTask = await TaskService.update(task.id, { status: nextStatus })
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask })
    } catch (err) {
      console.error("Erreur basculement statut tâche", err)
    }
  }, [])

  const setFilters = useCallback((f: Partial<TaskFilters>) => dispatch({ type:'SET_FILTERS', payload: f }), [])
  const login      = useCallback((u: User)    => dispatch({ type:'LOGIN', payload: u }), [])
  const logout     = useCallback(()           => {
    localStorage.removeItem('token')
    dispatch({ type:'LOGOUT' })
  }, [])

  return (
    <Ctx.Provider value={{ ...state, addTask, updateTask, deleteTask, toggleTask, setFilters, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTaskContext(): Ctx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useTaskContext must be inside TaskProvider')
  return c
}