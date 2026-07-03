import axios from 'axios';

// 🟢 MODE DE TEST SANS BASE DE DONNÉES / SANS BACKEND
// Change à true pour tester le Frontend de façon 100% autonome via localStorage.
// Change à false pour connecter l'application à l'API NestJS réelle et sa base de données MySQL.
export const USE_MOCK = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3000', // L'adresse de ton Backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur REQUEST : injecte automatiquement le token dans toutes les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur RESPONSE : gère les erreurs 401 (token invalide / expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl: string = error.config?.url ?? '';

      // Éviter la boucle infinie si le 401 vient des routes d'authentification elles-mêmes
      const isAuthRoute = requestUrl.includes('/auth/login') ||
                          requestUrl.includes('/auth/register');

      if (!isAuthRoute) {
        // Nettoyage du token invalide
        localStorage.removeItem('token');
        // Redirection propre vers la page de login
        // (window.location évite les conflits avec le routeur React)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;