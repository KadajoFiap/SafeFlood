const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://safeflood-api-java.onrender.com';

export interface UserData {
  nomeUsuario: string;
  email: string;
  tipoUsuario: string;
}

export interface User extends UserData {
  id: number;
  dataCadastro: string;
}

export const userService = {
  async listAll() {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao listar usuários');
    }

    return await response.json() as User[];
  },

  async findById(id: number) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao buscar usuário');
    }

    return await response.json() as User;
  },

  async findByEmail(email: string) {
    console.log('Buscando usuário por email:', email);
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/email/${email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Usuário não encontrado');
          return null;
        }
        
        let errorMessage = 'Erro ao buscar usuário';
        try {
          const text = await response.text();
          console.log('Resposta de erro:', text);
          if (text) {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          console.error('Erro ao processar resposta:', e);
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        const text = await response.text();
        console.log('Resposta recebida:', text);
        
        if (!text) {
          console.log('Resposta vazia recebida');
          return null;
        }

        const data = JSON.parse(text);
        console.log('Usuário encontrado:', data);
        return data as User;
      } catch (e) {
        console.error('Erro ao processar resposta JSON:', e);
        throw new Error('Erro ao processar resposta do servidor');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw new Error('Erro ao verificar usuário. Por favor, tente novamente.');
    }
  },

  async createUser(data: UserData) {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
      },
      body: JSON.stringify({
        ...data,
        dataCadastro: new Date().toISOString().split('T')[0]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 409) {
        throw new Error(errorData.message || 'Usuário já cadastrado');
      }
      throw new Error(errorData.message || 'Erro ao criar usuário');
    }

    return await response.json() as User;
  },

  async updateUser(id: number, data: Partial<UserData>) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao atualizar usuário');
    }

    return await response.json() as User;
  },

  async deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao deletar usuário');
    }
  }
}; 