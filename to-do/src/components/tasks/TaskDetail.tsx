import type { Task, TaskCategory } from '../../types'

const CAT_ICON: Record<TaskCategory, string> = {
  Travail:'🗂️', Personnel:'🌿', Sante:'❤️', Apprentissage:'📊', Finance:'💰',
}
const CAT_COLOR: Record<TaskCategory, string> = {
  Travail:'#7b8fff', Personnel:'#3ecf8e', Sante:'#f87171', Apprentissage:'#a78bfa', Finance:'#fbbf24',
}

interface Props { task:Task; onEdit:(t:Task)=>void; onDelete:(id:string)=>void; onToggle:(id:string)=>void; onClose:()=>void }

export default function TaskDetail({ task, onEdit, onDelete, onToggle, onClose }: Props) {
  const done  = task.status === 'done'
  const color = CAT_COLOR[task.category]

  return (
    <div className="panel" style={{ padding:'28px', display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:11, fontWeight:600, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Détail</p>
          <h3 style={{ fontSize:16, fontWeight:700, color:'var(--t1)', lineHeight:1.35, letterSpacing:'-.02em' }}>{task.name}</h3>
        </div>
        <button className="btn-icon" onClick={onClose} style={{ flexShrink:0, marginTop:2 }}>
          <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Badges */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:99, background:`${color}14`, border:`1px solid ${color}28` }}>
          <span style={{ fontSize:14 }}>{CAT_ICON[task.category]}</span>
          <span style={{ fontSize:12, fontWeight:600, color }}>{task.category}</span>
        </div>
        <div style={{ padding:'5px 12px', borderRadius:99, background: done ? 'rgba(62,207,142,.1)':'rgba(92,114,245,.1)', border:`1px solid ${done ? 'rgba(62,207,142,.25)':'rgba(92,114,245,.22)'}` }}>
          <span style={{ fontSize:12, fontWeight:600, color: done ? 'var(--green)':'var(--blue-h)' }}>
            {done ? '✓ Terminée' : '⏳ À faire'}
          </span>
        </div>
        {task.priority === 'urgent' && (
          <div style={{ padding:'5px 12px', borderRadius:99, background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.22)' }}>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--red)' }}>🔥 Urgent</span>
          </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <div style={{ padding:'14px 16px', borderRadius:12, background:'var(--s3)', border:'1px solid var(--l1)' }}>
          <p style={{ fontSize:13.5, color:'var(--t2)', lineHeight:1.65, fontWeight:400 }}>{task.description}</p>
        </div>
      )}

      {/* Meta */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, padding:'16px', borderRadius:12, background:'var(--s2)', border:'1px solid var(--l1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <svg width={14} height={14} fill="none" stroke="var(--t3)" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontSize:13, color:'var(--t2)' }}>{task.dueDate}</span>
          <span style={{ fontSize:12, color:'var(--t4)' }}>à</span>
          <svg width={14} height={14} fill="none" stroke="var(--t3)" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize:13, color:'var(--t2)' }}>{task.dueTime}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <svg width={14} height={14} fill="none" stroke="var(--t3)" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize:12.5, color:'var(--t3)' }}>Créé le {new Date(task.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}</span>
        </div>
      </div>

      {/* Toggle status */}
      <button onClick={() => onToggle(task.id)}
        style={{
          width:'100%', padding:'12px', borderRadius:12, cursor:'pointer',
          background:'transparent', border:'1.5px solid var(--l2)',
          fontSize:13.5, fontWeight:600, color:'var(--t2)',
          fontFamily:'Outfit,sans-serif', transition:'all .15s',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}
        onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background='var(--s3)'; (e.currentTarget as HTMLButtonElement).style.color='var(--t1)' }}
        onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.background='transparent'; (e.currentTarget as HTMLButtonElement).style.color='var(--t2)' }}>
        {done
          ? <><svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Marquer non faite</>
          : <><svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Marquer terminée</>
        }
      </button>

      {/* Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <button className="btn btn-ghost" style={{ padding:'10px', justifyContent:'center', gap:6 }} onClick={() => onEdit(task)}>
          <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Modifier
        </button>
        <button className="btn btn-danger" style={{ justifyContent:'center', gap:6 }} onClick={() => onDelete(task.id)}>
          <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
          Supprimer
        </button>
      </div>
    </div>
  )
}
