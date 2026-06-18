export type TaskStatus   = 'pending' | 'done'
export type TaskPriority = 'normal' | 'urgent'
export type TaskCategory = 'Travail' | 'Personnel' | 'Sante' | 'Apprentissage' | 'Finance'

export interface Task {
  id: string
  name: string
  description?: string
  category: TaskCategory
  status: TaskStatus
  priority: TaskPriority
  dueDate: string   // YYYY-MM-DD
  dueTime: string   // HH:MM
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
}

export type FilterStatus = 'all' | 'pending' | 'done'

export interface TaskFilters {
  status: FilterStatus
  category: 'all' | TaskCategory
  search: string
  sort: 'dueDate' | 'name' | 'createdAt'
}

export interface TaskStats {
  total: number
  done: number
  pending: number
  urgent: number
  completionRate: number
  byCategory: Record<TaskCategory, { total: number; done: number }>
}

/* ── Props interfaces ─────────────────────────────────────────────────────── */
export interface TaskRowProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onClick: (task: Task) => void
}

export interface TaskFormProps {
  initial?: Partial<Task>
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export interface StatCardProps {
  value: number | string
  label: string
  icon: string
  color: string
}

export interface GuideTableProps {
  title: string
  headers: string[]
  data: string[][]
}
