import { useState } from 'react'
import type { TaskFormProps, TaskCategory, TaskStatus, TaskPriority } from '../../types'

const CATS: TaskCategory[] = ['Travail','Personnel','Sante','Apprentissage','Finance']
const today   = new Date().toISOString().slice(0, 10)
const nowTime = new Date().toTimeString().slice(0, 5)

function Label({ text }: { text: string }) {
  return <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--t3)', letterSpacing:'.01em', textTransform:'uppercase', marginBottom:8 }}>{text}</label>
}

/** TaskForm — props: initial, onSubmit, onCancel */
export default function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [name,        setName]        = useState(initial?.name        ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category,    setCategory]    = useState<TaskCategory>(initial?.category ?? 'Travail')
  const [status,      setStatus]      = useState<TaskStatus>(initial?.status     ?? 'pending')
  const [priority,    setPriority]    = useState<TaskPriority>(initial?.priority  ?? 'normal')
  const [dueDate,     setDueDate]     = useState(initial?.dueDate     ?? today)
  const [dueTime,     setDueTime]     = useState(initial?.dueTime     ?? nowTime)
  const [error,       setError]       = useState('')

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!name.trim()) { setError('Le nom de la tâche est requis'); return }
    setError('')
    onSubmit({ name: name.trim(), description: description.trim(), category, status, priority, dueDate, dueTime })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:22 }}>

      {/* Name */}
      <div>
        <Label text="Nom de la tâche" />
        <input className="field" placeholder="ex : Finaliser le rapport Q1"
          value={name} onChange={e => { setName(e.target.value); setError('') }}
          style={{ fontSize:15, fontWeight:500 }}/>
        {error && <p style={{ fontSize:12.5, color:'var(--red)', marginTop:8, fontWeight:500 }}>{error}</p>}
      </div>

      {/* Description */}
      <div>
        <Label text="Description" />
        <textarea className="field field-textarea" placeholder="Détails optionnels…" rows={3}
          value={description} onChange={e => setDescription(e.target.value)}/>
      </div>

      {/* Category + Priority */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div>
          <Label text="Catégorie" />
          <select className="field-select" value={category} onChange={e => setCategory(e.target.value as TaskCategory)}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label text="Priorité" />
          <select className="field-select" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
            <option value="normal">Normale</option>
            <option value="urgent">🔥 Urgente</option>
          </select>
        </div>
      </div>

      {/* Date + Time */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div>
          <Label text="Date" />
          <input type="date" className="field" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
        </div>
        <div>
          <Label text="Heure" />
          <input type="time" className="field" value={dueTime} onChange={e => setDueTime(e.target.value)}/>
        </div>
      </div>

      {/* Status */}
      <div>
        <Label text="Statut" />
        <select className="field-select" value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
          <option value="pending">⏳ À faire</option>
          <option value="done">✓ Terminée</option>
        </select>
      </div>

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'flex-end', gap:12, paddingTop:8, borderTop:'1px solid var(--l1)', marginTop:4 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel} style={{ padding:'11px 24px' }}>Annuler</button>
        <button type="submit" className="btn btn-primary" style={{ padding:'11px 28px' }}>
          {initial?.name ? 'Enregistrer' : '+ Ajouter la tâche'}
        </button>
      </div>
    </form>
  )
}
