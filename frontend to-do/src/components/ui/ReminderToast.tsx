import { useEffect, useState } from 'react'
import { REMINDER_EVENT, type ReminderPayload } from '../../hooks/useTaskReminders'

interface ToastEntry {
  id: string     // taskId, sert aussi de clé unique
  taskName: string
  minutesLeft: number
  visible: boolean
}

/**
 * ReminderToast — affiche une notification in-app en bas à droite
 * lorsqu'un rappel de tâche est déclenché (événement `taskflow:reminder`).
 * Disparaît automatiquement après 12 secondes.
 */
export default function ReminderToast() {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  useEffect(() => {
    const handleReminder = (e: Event) => {
      const { taskId, taskName, minutesLeft } = (e as CustomEvent<ReminderPayload>).detail

      setToasts((prev) => {
        // Évite les doublons si la même tâche déclenche deux fois
        if (prev.some((t) => t.id === taskId)) return prev
        return [
          ...prev,
          { id: taskId, taskName, minutesLeft, visible: true },
        ]
      })

      // Disparition automatique après 12 secondes
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, visible: false } : t)),
        )
        // Suppression de l'entrée après l'animation de sortie (300ms)
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== taskId))
        }, 350)
      }, 12000)
    }

    window.addEventListener(REMINDER_EVENT, handleReminder)
    return () => window.removeEventListener(REMINDER_EVENT, handleReminder)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            background: 'linear-gradient(135deg, #0d1426 0%, #16223e 100%)',
            border: '1px solid rgba(251,191,36,.35)',
            borderRadius: 16,
            padding: '14px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,.55), 0 0 0 1px rgba(251,191,36,.12)',
            maxWidth: 340,
            minWidth: 280,
            opacity: toast.visible ? 1 : 0,
            transform: toast.visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity .3s ease, transform .3s ease',
          }}
        >
          {/* Icône */}
          <div
            style={{
              fontSize: 22,
              lineHeight: 1,
              marginTop: 2,
              flexShrink: 0,
            }}
          >
            ⏰
          </div>

          {/* Contenu */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#fbbf24',
                letterSpacing: '-.01em',
                marginBottom: 4,
              }}
            >
              Rappel de tâche
            </p>
            <p
              style={{
                fontSize: 13.5,
                color: '#e8eeff',
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              La tâche{' '}
              <strong style={{ color: '#fff' }}>«&nbsp;{toast.taskName}&nbsp;»</strong>{' '}
              doit être effectuée dans{' '}
              <strong style={{ color: '#fbbf24' }}>{toast.minutesLeft} minutes</strong>.
            </p>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={() =>
              setToasts((prev) =>
                prev.map((t) =>
                  t.id === toast.id ? { ...t, visible: false } : t,
                ),
              )
            }
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,.35)',
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
              marginTop: 2,
              transition: 'color .15s',
            }}
            aria-label="Fermer le rappel"
            title="Fermer"
            onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              'rgba(255,255,255,.7)')
            }
            onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              'rgba(255,255,255,.35)')
            }
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
