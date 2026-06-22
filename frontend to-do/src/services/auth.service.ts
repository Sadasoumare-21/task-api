import api, { USE_MOCK } from './api';

interface AuthResponse {
  access_token: string;
  user: {
    id: any;
    email: string;
    role: string;
    name: string;
  };
}

export const AuthService = {
  // Centralisation de la Connexion
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    if (USE_MOCK) {
      // Simulation locale pour tester le dashboard sans backend
      const mockUser = {
        id: '1',
        email: credentials.email,
        role: 'USER',
        name: credentials.email.split('@')[0],
      };
      
      // Génération d'un token JWT factice encodé en base64 pour que la restauration de session fonctionne
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: 1,
        email: credentials.email,
        role: 'USER',
        exp: Math.floor(Date.now() / 1000) + 86400 // Expire dans 24h
      }));
      const mockToken = `${header}.${payload}.signature`;

      return {
        access_token: mockToken,
        user: mockUser,
      };
    }

    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data && response.data.user) {
      response.data.user.id = String(response.data.user.id);
      response.data.user.name = response.data.user.email.split('@')[0];
    }
    
    return response.data;
  },

  // Centralisation de l'Inscription
  async register(credentials: { email: string; password: string }): Promise<AuthResponse> {
    if (USE_MOCK) {
      // Simulation locale pour tester l'inscription sans backend
      const mockUser = {
        id: '1',
        email: credentials.email,
        role: 'USER',
        name: credentials.email.split('@')[0],
      };
      
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: 1,
        email: credentials.email,
        role: 'USER',
        exp: Math.floor(Date.now() / 1000) + 86400
      }));
      const mockToken = `${header}.${payload}.signature`;

      return {
        access_token: mockToken,
        user: mockUser,
      };
    }

    const response = await api.post<AuthResponse>('/auth/register', credentials);
    
    if (response.data && response.data.user) {
      response.data.user.id = String(response.data.user.id);
      response.data.user.name = response.data.user.email.split('@')[0];
    }
    
    return response.data;
  },
};