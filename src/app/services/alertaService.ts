import api from '../config/api';

export interface Alerta {
  id?: number;
  titulo: string;
  descricao: string;
  nivelRisco: string;
  dataInicio: string;
  dataFim: string;
  latitude: number;
  longitude: number;
  uf: string;
  municipio: string;
  usuario: {
    id: number;
  };
}

export const createAlerta = async (alertaData: Alerta): Promise<Alerta> => {
  try {
    const response = await api.post<Alerta>('/alertas', alertaData);
    return response.data;
  } catch (error: unknown) {
    console.error('Erro ao criar alerta:', error);
    const err = error as { [key: string]: any };
    if (error && typeof error === 'object' && 'isAxiosError' in error && err.isAxiosError && err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error('Erro ao criar alerta. Por favor, tente novamente.');
  }
};

export const getAlertas = async (): Promise<Alerta[]> => {
  try {
    const response = await api.get<Alerta[]>('/alertas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    throw new Error('Erro ao buscar alertas. Por favor, tente novamente.');
  }
};

export const getAlertaById = async (id: number): Promise<Alerta> => {
  try {
    const response = await api.get<Alerta>(`/alertas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar alerta:', error);
    throw new Error('Erro ao buscar alerta. Por favor, tente novamente.');
  }
};

export const updateAlerta = async (id: number, alertaData: Partial<Alerta>): Promise<Alerta> => {
  try {
    const response = await api.put<Alerta>(`/alertas/atualizar/${id}`, alertaData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar alerta:', error);
    throw new Error('Erro ao atualizar alerta. Por favor, tente novamente.');
  }
};

export const deleteAlerta = async (id: number): Promise<void> => {
  try {
    await api.delete(`/alertas/deletar/${id}`);
  } catch (error) {
    console.error('Erro ao deletar alerta:', error);
    throw new Error('Erro ao deletar alerta. Por favor, tente novamente.');
  }
}; 