'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthUser {
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
  [key: string]: unknown;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  confirm: (username: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Decodifica o token para preencher user
      const payload = parseJwt(token);
      const userData = payload ? {
        username: typeof payload.username === 'string' ? payload.username : (typeof payload.sub === 'string' ? payload.sub : undefined),
        email: typeof payload.email === 'string' ? payload.email : undefined,
        role: (typeof payload.role === 'string' && (payload.role === 'admin' || payload.role === 'user')) ? payload.role as 'admin' | 'user' : 'user'
      } : null;
      setUser(userData);
      setIsAdmin(userData?.role === 'admin');
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
        const userData = payload ? {
          username: typeof payload.username === 'string' ? payload.username : (typeof payload.sub === 'string' ? payload.sub : undefined),
          email: typeof payload.email === 'string' ? payload.email : undefined,
          role: (typeof payload.role === 'string' && (payload.role === 'admin' || payload.role === 'user')) ? payload.role as 'admin' | 'user' : 'user'
        } : null;
        setUser(userData);
        setIsAdmin(userData?.role === 'admin');
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
        isAdmin,
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