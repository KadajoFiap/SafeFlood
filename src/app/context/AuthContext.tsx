'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  confirm: (username: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Decodifica o token para preencher user
      const payload = parseJwt(token);
      setUser(payload ? {
        username: payload.username || payload.sub,
        email: payload.email
      } : null);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      const accessToken = response.tokens?.AccessToken;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        setIsAuthenticated(true);
        const payload = parseJwt(accessToken);
        setUser(payload ? {
          username: payload.username || payload.sub,
          email: payload.email
        } : null);
      } else {
        throw new Error('Token de acesso não encontrado na resposta da API.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await authService.register({ username, email, password });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const confirm = async (username: string, code: string) => {
    try {
      await authService.confirm({ username, code });
    } catch (error) {
      console.error('Confirmation error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        confirm,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 