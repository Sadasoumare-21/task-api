import type { TaskCardProps } from '../../types'

const STATUS = {
  done:          { dot:'bg-[var(--accent)]',   label:'Terminee',  bg:'bg-[var(--accent)]/10 text-[var(--accent)]' },
  'in-progress': { dot:'bg-[var(--primary)]',  label:'En cours',  bg:'bg-[var(--primary)]/10 text-[var(--primary)]' },
  pending:       { dot:'bg-[var(--warn)]',     label:'A faire',   bg:'bg-[var(--warn)]/10 text-[var(--warn)]' },
}

const CAT_COLORS: Record<string,string> = {
  Travail:'#7c6dfa', Personnel:'#00d4aa', Sante:'#ff6b6b',
  Apprentissage:'#ffb347', Projets:'#00bcd4', Autre:'#9191b5',
}

/** TaskCard — props : task, onToggle, onEdit, onDelete, onClick */
export default function TaskCard({ task, onToggle, onEdit, onDelete, onClick }: TaskCardProps) {
  const s = STATUS[task.status]
  const c = CAT_COLORS[task.category] ?? '#9191b5'
  const overdue = task.status !== 'done' && new Date(`${task.dueDate}T${task.dueTime}`) < new Date()

  return (
    <div className="glass rounded-2xl p-4 cursor-pointer group hover:border-[var(--primary)]/30 transition-all" onClick={() => onClick(task)}>
      <div className="flex items-start gap-3">
        {/* Toggle */}
        <button onClick={e => { e.stopPropagation(); onToggle(task.id) }}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${task.status==='done' ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--accent)]'}`}
          title={task.status==='done' ? 'Marquer non fait' : 'Marquer terminee'}>
          {task.status==='done' && <svg className="w-3 h-3 text-[var(--bg-base)]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
        </button>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold truncate mb-1 ${task.status==='done' ? 'line-through text-[var(--text-3)]' : 'text-[var(--text-1)]'}`}>{task.name}</h4>
          {task.description && <p className="text-xs text-[var(--text-3)] truncate mb-2">{task.description}</p>}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${s.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{s.label}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background:`${c}20`, color:c }}>{task.category}</span>
            <span className={`text-[10px] ${overdue ? 'text-[var(--danger)]' : 'text-[var(--text-3)]'}`}>
              {task.dueDate} {task.dueTime}{overdue && ' · En retard'}
            </span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(task)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors" title="Modifier">✎</button>
          <button onClick={() => onDelete(task.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors" title="Supprimer">🗑</button>
        </div>
      </div>
    </div>
  )
}
