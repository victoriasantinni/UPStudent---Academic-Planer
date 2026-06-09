const API_URL = 'http://localhost:3001';

const getHeaders = () => {
  const token = localStorage.getItem('@UPStudent:token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erro ao fazer login');
    }
    return res.json();
  },

  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erro ao registrar conta');
    }
    return res.json();
  },

  getDias: async () => {
    const res = await fetch(`${API_URL}/days`, { 
      headers: getHeaders() 
    });
    if (!res.ok) throw new Error('Erro ao buscar o cronograma');
    return res.json();
  },

  updateDia: async (diaId: string, aulas: any[]) => {
    const res = await fetch(`${API_URL}/days/${diaId}`, {
      method: 'PATCH',
      headers: getHeaders(), 
      body: JSON.stringify({ aulas }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar');
    return res.json();
  },
};