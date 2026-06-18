import { useMemo } from 'react'
import { useTaskContext } from '../context/TaskContext'
import type { Task, TaskStats, TaskCategory } from '../types'

const CATS: TaskCategory[] = ['Travail','Personnel','Sante','Apprentissage','Finance']

export function useTasks() {
  const ctx = useTaskContext()
  const { tasks, filters } = ctx

  const filteredTasks = useMemo<Task[]>(() => {
    let r = [...tasks]
    if (filters.status !== 'all')   r = r.filter(t => t.status === filters.status)
    if (filters.category !== 'all') r = r.filter(t => t.category === filters.category)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      r = r.filter(t => t.name.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q))
    }
    r.sort((a, b) => {
      if (filters.sort === 'name')    return a.name.localeCompare(b.name)
      if (filters.sort === 'dueDate') return `${a.dueDate}T${a.dueTime}`.localeCompare(`${b.dueDate}T${b.dueTime}`)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return r
  }, [tasks, filters])

  const todayTasks = useMemo<Task[]>(() => {
    const today = new Date().toISOString().slice(0, 10)
    return tasks.filter(t => t.dueDate === today)
  }, [tasks])

  const stats = useMemo<TaskStats>(() => {
    const total  = tasks.length
    const done   = tasks.filter(t => t.status === 'done').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const urgent = tasks.filter(t => t.priority === 'urgent').length
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0
    const byCategory = CATS.reduce((acc, cat) => {
      const catTasks = tasks.filter(t => t.category === cat)
      acc[cat] = { total: catTasks.length, done: catTasks.filter(t => t.status === 'done').length }
      return acc
    }, {} as Record<TaskCategory, { total: number; done: number }>)
    return { total, done, pending, urgent, completionRate, byCategory }
  }, [tasks])

  return { filteredTasks, todayTasks, stats, CATS, ...ctx }
}
