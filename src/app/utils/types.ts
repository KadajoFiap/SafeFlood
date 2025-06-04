export interface AlertaINMET {
  id: number;
  data_inicio: string;
  data_fim: string;
  municipios: string;
  poligono: string;
  severidade: string;
  descricao: string;
}

export interface PontoDeRisco {
  id: number;
  latitude: number;
  longitude: number;
  nivel: 'Alto' | 'Médio' | 'Baixo';
  descricao: string;
  inicio: string;
  fim: string;
  uf: string;
  municipio: string;
}

export type RiskLevel = 'Alto' | 'Médio' | 'Baixo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  confirmPassword: string;
}

export interface EmailConfirmationData {
  email: string;
  code: string;
} 