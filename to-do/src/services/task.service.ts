export const TaskService = {
  // GET /tasks - Récupérer toutes les tâches locales
  getAll: async (): Promise<any[]> => {
    const tasksStr = localStorage.getItem('mock_tasks') || '[]'
    return JSON.parse(tasksStr)
  },

  // POST /tasks - Créer une tâche locale
  create: async (taskData: any): Promise<any> => {
    const tasksStr = localStorage.getItem('mock_tasks') || '[]'
    const tasks = JSON.parse(tasksStr)

    // Résoudre l'objet catégorie associé
    const catsStr = localStorage.getItem('mock_categories') || '[]'
    const cats = JSON.parse(catsStr)
    const category = cats.find((c: any) => c.id === taskData.categoryId) || null

    const newTask = {
      id: Math.floor(Math.random() * 1000000) + 1,
      title: taskData.title,
      description: taskData.description || '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      category
    }

    tasks.push(newTask)
    localStorage.setItem('mock_tasks', JSON.stringify(tasks))
    return newTask
  },

  // PATCH /tasks/:id - Mettre à jour une tâche locale
  update: async (id: string, taskData: any): Promise<any> => {
    const tasksStr = localStorage.getItem('mock_tasks') || '[]'
    const tasks = JSON.parse(tasksStr)
    
    const taskIndex = tasks.findIndex((t: any) => String(t.id) === String(id))
    if (taskIndex === -1) {
      throw new Error(`Tâche ${id} introuvable`)
    }

    const task = tasks[taskIndex]
    
    if (taskData.title !== undefined) task.title = taskData.title
    if (taskData.description !== undefined) task.description = taskData.description
    if (taskData.status !== undefined) task.status = taskData.status

    if (taskData.categoryId !== undefined) {
      const catsStr = localStorage.getItem('mock_categories') || '[]'
      const cats = JSON.parse(catsStr)
      task.category = cats.find((c: any) => c.id === taskData.categoryId) || null
    }

    tasks[taskIndex] = task
    localStorage.setItem('mock_tasks', JSON.stringify(tasks))
    return task
  },

  // DELETE /tasks/:id - Supprimer une tâche locale
  delete: async (id: string): Promise<void> => {
    const tasksStr = localStorage.getItem('mock_tasks') || '[]'
    const tasks = JSON.parse(tasksStr)
    const filtered = tasks.filter((t: any) => String(t.id) !== String(id))
    localStorage.setItem('mock_tasks', JSON.stringify(filtered))
  }
}