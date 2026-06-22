import api, { USE_MOCK } from './api';

export interface Category {
  id: number;
  name: string;
}

const DEFAULT_CATS = ['Travail', 'Personnel', 'Sante', 'Apprentissage', 'Finance'];

export const CategoryService = {
  // Récupère toutes les catégories
  getAll: async (): Promise<Category[]> => {
    if (USE_MOCK) {
      const catsStr = localStorage.getItem('mock_categories');
      if (!catsStr) {
        const initial = DEFAULT_CATS.map((name, i) => ({ id: i + 1, name }));
        localStorage.setItem('mock_categories', JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(catsStr);
    }

    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  // Crée une nouvelle catégorie
  create: async (name: string): Promise<Category> => {
    if (USE_MOCK) {
      const cats = await CategoryService.getAll();
      const nextId = cats.reduce((max, c) => c.id > max ? c.id : max, 0) + 1;
      const newCat = { id: nextId, name };
      cats.push(newCat);
      localStorage.setItem('mock_categories', JSON.stringify(cats));
      return newCat;
    }

    const response = await api.post<Category>('/categories', { name });
    return response.data;
  },
};
