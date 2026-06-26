import { useEffect, useRef } from 'react'
import type { Task } from '../types'

// ─── Événement personnalisé diffusé quand un rappel se déclenche ─────────────
export const REMINDER_EVENT = 'taskflow:reminder'

export interface ReminderPayload {
  taskId: string
  taskName: string
  minutesLeft: number
}

/**
 * Planifie un rappel in-app pour chaque tâche dont la date/heure est connue.
 * Le rappel se déclenche ~7 minutes avant l'échéance (dans la fenêtre 5–10 min).
 * Utilise window.setTimeout et nettoie les timers obsolètes automatiquement.
 */
export function useTaskReminders(tasks: Task[]) {
  // Map<taskId, timeoutId>
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const now = Date.now()
    const activeIds = new Set<string>()

    tasks.forEach((task) => {
      if (task.status === 'done') return
      if (!task.dueDate || !task.dueTime) return

      const dueMs = new Date(`${task.dueDate}T${task.dueTime}:00`).getTime()
      if (isNaN(dueMs)) return

      // Fenêtre de rappel : entre 5 et 10 min avant l'échéance
      const REMIND_BEFORE_MS = 7 * 60 * 1000   // 7 minutes avant (milieu de la fenêtre)
      const reminderMs = dueMs - REMIND_BEFORE_MS
      const delay = reminderMs - now

      // Si l'échéance est déjà passée ou trop proche (< 1 min), on ne programme rien
      if (delay < 60 * 1000) return

      activeIds.add(task.id)

      // Si un timer existe déjà pour cette tâche, on ne le re-crée pas
      if (timersRef.current.has(task.id)) return

      const minutesLeft = Math.round((dueMs - now) / 60000)

      const timerId = setTimeout(() => {
        const payload: ReminderPayload = {
          taskId: task.id,
          taskName: task.name,
          minutesLeft: 7,
        }
        window.dispatchEvent(new CustomEvent(REMINDER_EVENT, { detail: payload }))
        timersRef.current.delete(task.id)
      }, delay)

      timersRef.current.set(task.id, timerId)
    })

    // Nettoyer les timers de tâches qui n'existent plus (supprimées)
    timersRef.current.forEach((timerId, taskId) => {
      if (!activeIds.has(taskId)) {
        clearTimeout(timerId)
        timersRef.current.delete(taskId)
      }
    })
  }, [tasks])

  // Nettoyage global au démontage
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => clearTimeout(timerId))
      timersRef.current.clear()
    }
  }, [])
}
