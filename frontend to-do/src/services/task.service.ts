import api, { USE_MOCK } from './api';

export interface Task {
  id: any; // Accepte string ou number pour éviter les conflits de type
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED' | string; // Correspond au statut de ton interface
  categoryId?: number;
  createdAt: string;
  category?: any;
}

export const TaskService = {
  // 🟢 Récupérer uniquement les tâches de l'utilisateur connecté
  async getAll(): Promise<Task[]> {
    if (USE_MOCK) {
      const tasksStr = localStorage.getItem('mock_tasks');
      if (!tasksStr) {
        const initial: Task[] = [];
        localStorage.setItem('mock_tasks', JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(tasksStr);
    }

    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  // 🟢 Créer une nouvelle tâche sur le backend ou en local
  async create(taskData: { title: string; description?: string; categoryId?: number }): Promise<Task> {
    if (USE_MOCK) {
      const tasks = await TaskService.getAll();
      const nextId = tasks.reduce((max, t) => Number(t.id) > max ? Number(t.id) : max, 0) + 1;
      const newTask: Task = {
        id: nextId,
        title: taskData.title,
        description: taskData.description,
        status: 'PENDING',
        categoryId: taskData.categoryId,
        category: taskData.categoryId ? { id: taskData.categoryId } : undefined,
        createdAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      localStorage.setItem('mock_tasks', JSON.stringify(tasks));
      return newTask;
    }

    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  // 🟢 Modifier le statut ou le contenu d'une tâche
  async update(id: any, taskData: Partial<Task>): Promise<Task> {
    if (USE_MOCK) {
      const tasks = await TaskService.getAll();
      const index = tasks.findIndex(t => String(t.id) === String(id));
      if (index === -1) throw new Error('Tâche introuvable');

      const updatedTask = {
        ...tasks[index],
        ...taskData,
        // Conversion de statut pour s'aligner avec le backend NestJS
        status: taskData.status === 'done'
          ? 'COMPLETED'
          : taskData.status === 'pending'
            ? 'PENDING'
            : (taskData.status || tasks[index].status)
      };

      tasks[index] = updatedTask;
      localStorage.setItem('mock_tasks', JSON.stringify(tasks));
      return updatedTask;
    }

    const response = await api.patch<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // 🟢 Supprimer une tâche
  async delete(id: any): Promise<void> {
    if (USE_MOCK) {
      const tasks = await TaskService.getAll();
      const filtered = tasks.filter(t => String(t.id) !== String(id));
      localStorage.setItem('mock_tasks', JSON.stringify(filtered));
      return;
    }

    await api.delete(`/tasks/${id}`);
  }
};