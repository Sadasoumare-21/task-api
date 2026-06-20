// src/services/task.service.ts
import { api } from './api'
import { Task } from '../types'

export const TaskService = {
  // GET /tasks - Récupérer toutes les tâches de l'utilisateur connecté
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/tasks')
    return response.data
  },

  // POST /tasks - Créer une nouvelle tâche
  create: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const response = await api.post('/tasks', taskData)
    return response.data
  },

  // PATCH ou PUT /tasks/:id - Modifier une tâche existante
  update: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, taskData)
    return response.data
  },

  // DELETE /tasks/:id - Supprimer une tâche
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  }
}