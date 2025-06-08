import api from '../config/api';

export interface User {
  id?: number;
  nomeUsuario: string;
  email: string;
  senha?: string;
  tipoUsuario: string;
}

export const findByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await api.get<User>(`/usuarios/email/${email}`);
    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', response.headers);
    
    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error: unknown) {
    console.error('Erro ao buscar usuário por email:', error);
    const err = error as { [key: string]: any };
    if (error && typeof error === 'object' && 'isAxiosError' in error && err.isAxiosError && err.response?.status === 404) {
      console.log('Usuário não encontrado');
      return null;
    }
    throw new Error('Erro ao buscar usuário. Por favor, tente novamente.');
  }
};

export const createUser = async (userData: User): Promise<User> => {
  try {
    console.log('Enviando dados para criar usuário:', JSON.stringify(userData, null, 2));
    const response = await api.post<User>('/usuarios', userData);
    console.log('Resposta da criação de usuário:', response.data);
    
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
    throw new Error('Erro ao criar usuário. Por favor, tente novamente.');
  } catch (error: unknown) {
    console.error('Erro detalhado ao criar usuário:', error);
    const err = error as { [key: string]: any };
    if (error && typeof error === 'object' && 'isAxiosError' in error && err.isAxiosError) {
      if (err.response?.status === 409) {
        throw new Error('Usuário com este email já existe.');
      }
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error('Erro ao criar usuário. Por favor, tente novamente.');
  }
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<User>(`/usuarios/atualizar/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Erro ao atualizar usuário. Por favor, tente novamente.');
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/usuarios/deletar/${id}`);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Erro ao deletar usuário. Por favor, tente novamente.');
  }
}; 