import { DiaEstudo, Aula } from '../types';

const API_URL = 'https://upstudent-api.onrender.com';

export const api = {
  getDias: async (): Promise<DiaEstudo[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('API Offline');
    return res.json();
  },
  
  updateDia: async (diaId: string, aulas: Aula[]) => {
    const res = await fetch(`${API_URL}/${diaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aulas })
    });
    if (!res.ok) throw new Error('Erro ao atualizar');
    return res.json();
  }
};