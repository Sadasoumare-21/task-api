export interface Category {
  id: number
  name: string
}

const DEFAULT_CATS = ['Travail', 'Personnel', 'Sante', 'Apprentissage', 'Finance', 'Projets', 'Autre']

export const CategoryService = {
  // GET /categories - Récupérer toutes les catégories
  getAll: async (): Promise<Category[]> => {
    const catsStr = localStorage.getItem('mock_categories')
    if (!catsStr) {
      const initial = DEFAULT_CATS.map((name, i) => ({ id: i + 1, name }))
      localStorage.setItem('mock_categories', JSON.stringify(initial))
      return initial
    }
    return JSON.parse(catsStr)
  },

  // POST /categories - Créer une nouvelle catégorie
  create: async (name: string): Promise<Category> => {
    const cats = await CategoryService.getAll()
    const nextId = cats.reduce((max, c) => c.id > max ? c.id : max, 0) + 1
    const newCat = { id: nextId, name }
    cats.push(newCat)
    localStorage.setItem('mock_categories', JSON.stringify(cats))
    return newCat
  }
}
