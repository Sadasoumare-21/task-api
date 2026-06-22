interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const AuthService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    // Lecture de la liste d'utilisateurs locale
    const usersStr = localStorage.getItem('mock_users') || '[]';
    const users: any[] = JSON.parse(usersStr);
    
    let user = users.find(u => u.email === credentials.email);
    if (!user) {
      // Auto-création au premier essai de connexion pour faciliter les tests du jury / de l'utilisateur
      user = {
        id: Math.random().toString(36).substring(2, 11),
        email: credentials.email,
        role: 'USER',
        name: credentials.email.split('@')[0]
      };
      users.push(user);
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
    
    return {
      access_token: 'mock-jwt-token-' + user.id,
      user
    };
  },

  async register(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const usersStr = localStorage.getItem('mock_users') || '[]';
    const users: any[] = JSON.parse(usersStr);
    
    let user = users.find(u => u.email === credentials.email);
    if (user) {
      throw new Error('Cet utilisateur existe déjà.');
    }
    
    user = {
      id: Math.random().toString(36).substring(2, 11),
      email: credentials.email,
      role: 'USER',
      name: credentials.email.split('@')[0]
    };
    users.push(user);
    localStorage.setItem('mock_users', JSON.stringify(users));
    
    return {
      access_token: 'mock-jwt-token-' + user.id,
      user
    };
  },
};