const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://7njq158dja.execute-api.sa-east-1.amazonaws.com';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ConfirmData {
  username: string;
  code: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const authService = {
  // Serviço Amazon Cognito
  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao registrar');
    }

    return await response.json();
  },

  async confirm(data: ConfirmData) {
    const response = await fetch(`${API_BASE_URL}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: LoginData) {
    console.log('Login request data:', data);
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log('Login API response:', result);
    
    if (result.tokens?.IdToken) {
      const token = result.tokens.IdToken;
      console.log('ID Token:', token);
      // Decodificar o token para verificar o payload
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('User role from token:', payload.role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    return result;
  },

  async logout() {
    const token = localStorage.getItem('idToken');
    console.log('Logout token:', token);
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.json();
  }
}; 