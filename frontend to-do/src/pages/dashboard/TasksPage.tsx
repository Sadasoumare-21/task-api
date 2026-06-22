import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import TaskCard from '../../components/tasks/TaskCard'
import TaskDetail from '../../components/tasks/TaskDetail'
import Modal from '../../components/ui/Modal'
import TaskForm from '../../components/tasks/TaskForm'
import Button from '../../components/ui/Button'
import type { Task, TaskCategory } from '../../types'

const CATS: TaskCategory[] = ['Travail','Personnel','Sante','Apprentissage','Projets','Autre']

export default function TasksPage() {
  const { filteredTasks, addTask, updateTask, deleteTask, toggleTask, filters, setFilters } = useTasks()
  const [selected, setSelected] = useState<Task|null>(null)
  const [editing,  setEditing]  = useState<Task|null>(null)
  const [showAdd,  setShowAdd]  = useState(false)

  const handleAdd    = (d: Omit<Task,'id'|'createdAt'>) => { addTask(d); setShowAdd(false) }
  const handleUpdate = (d: Omit<Task,'id'|'createdAt'>) => { if(!editing) return; updateTask({...editing,...d}); setEditing(null) }
  const handleDelete = (id: string) => { deleteTask(id); if(selected?.id===id) setSelected(null) }

  const SEL = "bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--primary)] transition-colors"
  const filterBtn = (active: boolean) => `px-3 py-1 rounded-full text-xs font-medium transition-all ${active ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-2)] hover:bg-[var(--bg-hover)]'}`
  const catBtn    = (active: boolean) => `px-3 py-1 rounded-full text-xs font-medium transition-all ${active ? 'bg-[var(--accent)] text-[var(--bg-base)]' : 'bg-[var(--bg-card)] text-[var(--text-2)] hover:bg-[var(--bg-hover)]'}`

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text-1)]">Mes taches <span className="text-sm font-normal text-[var(--text-3)]">({filteredTasks.length})</span></h1>
          <Button onClick={() => setShowAdd(true)}>+ Ajouter</Button>
        </div>

        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex gap-3 flex-wrap">
            <input type="text" placeholder="Rechercher..." value={filters.search} onChange={e => setFilters({search:e.target.value})}
              className="flex-1 min-w-40 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] transition-colors"/>
            <select value={filters.sort} onChange={e => setFilters({sort: e.target.value as 'dueDate'|'createdAt'|'name'})} className={SEL}>
              <option value="dueDate">Trier : Date</option>
              <option value="createdAt">Trier : Creee</option>
              <option value="name">Trier : Nom</option>
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-[var(--text-3)] self-center">Statut :</span>
            {(['all','pending','in-progress','done'] as const).map(s => {
              const L = {all:'Tous',pending:'A faire','in-progress':'En cours',done:'Terminees'}
              return <button key={s} onClick={() => setFilters({status:s})} className={filterBtn(filters.status===s)}>{L[s]}</button>
            })}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-[var(--text-3)] self-center">Categorie :</span>
            <button onClick={() => setFilters({category:'all'})} className={catBtn(filters.category==='all')}>Toutes</button>
            {CATS.map(c => <button key={c} onClick={() => setFilters({category:c})} className={catBtn(filters.category===c)}>{c}</button>)}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredTasks.length===0 ? (
            <div className="glass rounded-2xl p-12 text-center"><div className="text-4xl mb-3">🔍</div><p className="text-[var(--text-2)]">Aucune tache trouvee</p></div>
          ) : filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} onEdit={setEditing} onDelete={handleDelete} onClick={setSelected}/>
          ))}
        </div>
      </div>

      {selected && (
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <TaskDetail task={selected} onEdit={t => { setEditing(t); setSelected(null) }} onDelete={id => { handleDelete(id); setSelected(null) }} onToggle={toggleTask} onClose={() => setSelected(null)}/>
          </div>
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle tache">
        <TaskForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)}/>
      </Modal>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Modifier la tache">
        {editing && <TaskForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)}/>}
      </Modal>
    </div>
  )
}
