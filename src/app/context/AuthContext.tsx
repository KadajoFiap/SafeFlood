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
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('JWT Payload:', payload);
    console.log('Raw role from token:', payload['custom:role']);
    console.log('Role type:', typeof payload['custom:role']);
    return payload;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('idToken');
    console.log('Stored ID token:', token);
    if (token) {
      setIsAuthenticated(true);
      // Decodifica o token para preencher user
      const payload = parseJwt(token);
      console.log('Token payload in useEffect:', payload);
      const userData = payload ? {
        username: typeof payload['cognito:username'] === 'string' ? payload['cognito:username'] : (typeof payload.sub === 'string' ? payload.sub : undefined),
        email: typeof payload.email === 'string' ? payload.email : undefined,
        role: (typeof payload['custom:role'] === 'string' && (payload['custom:role'] === 'admin' || payload['custom:role'] === 'user')) ? payload['custom:role'] as 'admin' | 'user' : 'user'
      } : null;
      console.log('Processed user data:', userData);
      console.log('Role from processed data:', userData?.role);
      setUser(userData);
      const isUserAdmin = userData?.role === 'admin';
      console.log('Is user admin?', isUserAdmin);
      setIsAdmin(isUserAdmin);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('Login attempt for user:', username);
      const response = await authService.login({ username, password });
      const idToken = response.tokens?.IdToken;
      console.log('ID token received:', idToken);
      if (idToken) {
        localStorage.setItem('idToken', idToken);
        setIsAuthenticated(true);
        const payload = parseJwt(idToken);
        console.log('Token payload in login:', payload);
        const userData = payload ? {
          username: typeof payload['cognito:username'] === 'string' ? payload['cognito:username'] : (typeof payload.sub === 'string' ? payload.sub : undefined),
          email: typeof payload.email === 'string' ? payload.email : undefined,
          role: (typeof payload['custom:role'] === 'string' && (payload['custom:role'] === 'admin' || payload['custom:role'] === 'user')) ? payload['custom:role'] as 'admin' | 'user' : 'user'
        } : null;
        console.log('Processed user data in login:', userData);
        console.log('Role from processed data in login:', userData?.role);
        setUser(userData);
        const isUserAdmin = userData?.role === 'admin';
        console.log('Is user admin in login?', isUserAdmin);
        setIsAdmin(isUserAdmin);
      } else {
        throw new Error('Token de ID não encontrado na resposta da API.');
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
      localStorage.removeItem('idToken');
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
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