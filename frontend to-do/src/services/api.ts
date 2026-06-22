import axios from 'axios';

// 🟢 MODE DE TEST SANS BASE DE DONNÉES / SANS BACKEND
// Change à true pour tester le Frontend de façon 100% autonome via localStorage.
// Change à false pour connecter l'application à l'API NestJS réelle et sa base de données MySQL.
export const USE_MOCK = false;

const api = axios.create({
  baseURL: 'http://localhost:3000', // L'adresse de ton Backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le token dans toutes les futures requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;