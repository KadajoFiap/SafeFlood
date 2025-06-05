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
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
}; 