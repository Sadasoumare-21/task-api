import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import TaskRow    from '../../components/tasks/TaskRow'
import TaskDetail from '../../components/tasks/TaskDetail'
import Modal      from '../../components/ui/Modal'
import TaskForm   from '../../components/tasks/TaskForm'
import type { Task } from '../../types'

export default function DashboardPage() {
  const { filteredTasks, addTask, updateTask, deleteTask, toggleTask, filters, setFilters } = useTasks()
  const [selected, setSelected] = useState<Task | null>(null)
  const [editing,  setEditing]  = useState<Task | null>(null)
  const [showAdd,  setShowAdd]  = useState(false)

  const handleAdd    = (d: Omit<Task,'id'|'createdAt'>) => { addTask(d); setShowAdd(false) }
  const handleUpdate = (d: Omit<Task,'id'|'createdAt'>) => { if (!editing) return; updateTask({ ...editing, ...d }); setEditing(null) }
  const handleDelete = (id: string) => { deleteTask(id); if (selected?.id === id) setSelected(null) }

  const total   = filteredTasks.length
  const pending = filteredTasks.filter(t => t.status === 'pending').length
  const done    = filteredTasks.filter(t => t.status === 'done').length

  return (
    <div style={{ display:'flex', gap:32, alignItems:'flex-start' }}>

      {/* ── MAIN COLUMN ───────────────────────────────────────────────── */}
      <div style={{ flex:1, minWidth:0 }}>

        {/* Page header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:36 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'var(--t1)', letterSpacing:'-1px', lineHeight:1.1, marginBottom:8 }}>
              Mes tâches
            </h1>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:13.5, color:'var(--t3)', fontWeight:400 }}>
                {total} tâche{total > 1 ? 's' : ''} au total
              </span>
              <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--t4)', display:'inline-block' }}/>
              <span style={{ fontSize:13.5, color:'var(--t3)' }}>{pending} à faire</span>
              <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--t4)', display:'inline-block' }}/>
              <span style={{ fontSize:13.5, color:'var(--green)' }}>✓ {done} terminées</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}
            style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvelle tâche
          </button>
        </div>

        {/* ── FILTER BAR ────────────────────────────────────────────────── */}
        <div style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'20px 24px',
          background:'var(--s1)', border:'1px solid var(--l1)', borderRadius:18,
          marginBottom:24,
        }}>
          {/* Search — wide and prominent */}
          <div className="search-wrap">
            <svg className="search-icon" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Rechercher une tâche..."
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
            />
          </div>

          {/* Divider */}
          <div style={{ width:1, height:32, background:'var(--l2)', flexShrink:0 }}/>

          {/* Status filter */}
          <select className="field-select"
            style={{ minWidth:130 }}
            value={filters.status}
            onChange={e => setFilters({ status: e.target.value as 'all'|'pending'|'done' })}>
            <option value="all">Toutes les tâches</option>
            <option value="pending">À faire</option>
            <option value="done">Terminées</option>
          </select>

          {/* Sort */}
          <select className="field-select"
            style={{ minWidth:130 }}
            value={filters.sort}
            onChange={e => setFilters({ sort: e.target.value as 'dueDate'|'name'|'createdAt' })}>
            <option value="dueDate">Par priorité</option>
            <option value="name">Par nom</option>
            <option value="createdAt">Plus récentes</option>
          </select>
        </div>

        {/* ── TASK LIST ─────────────────────────────────────────────────── */}
        <div className="panel" style={{ overflow:'hidden' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ padding:'80px 32px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
              <p style={{ fontSize:16, fontWeight:600, color:'var(--t2)', marginBottom:8 }}>Aucune tâche trouvée</p>
              <p style={{ fontSize:14, color:'var(--t3)', lineHeight:1.6 }}>
                Modifiez vos filtres ou créez une nouvelle tâche.
              </p>
            </div>
          ) : filteredTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={t => { setEditing(t); setSelected(null) }}
              onDelete={handleDelete}
              onClick={setSelected}
            />
          ))}
        </div>
      </div>

      {/* ── DETAIL PANEL ──────────────────────────────────────────────── */}
      {selected && (
        <div style={{ width:300, flexShrink:0 }} className="fx-in">
          <div style={{ position:'sticky', top:0 }}>
            <TaskDetail
              task={selected}
              onEdit={t => { setEditing(t); setSelected(null) }}
              onDelete={id => { handleDelete(id); setSelected(null) }}
              onToggle={toggleTask}
              onClose={() => setSelected(null)}
            />
          </div>
        </div>
      )}

      {/* ── MODALS ────────────────────────────────────────────────────── */}
      <Modal isOpen={showAdd}  onClose={() => setShowAdd(false)} title="Nouvelle tâche">
        <TaskForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Modifier la tâche">
        {editing && <TaskForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
