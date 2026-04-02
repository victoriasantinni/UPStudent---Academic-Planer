import { useState, useEffect, useCallback, useMemo } from 'react';
import { DiaEstudo, Aula } from '../types';
import { api } from '../services/api';

export function useGrade() {
  const [dias, setDias] = useState<DiaEstudo[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  const carregarDados = useCallback(async () => {
    try {
      setStatus('loading');
      const dados = await api.getDias();
      setDias(dados);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const totalAulas = useMemo(() => 
    dias.reduce((acc, dia) => acc + (dia.aulas?.length || 0), 0), 
  [dias]);

  const adicionarAula = async (diaId: string) => {
    const dia = dias.find(d => d.id === diaId);
    if (!dia) return null;

    const nova: Aula = {
      id: Date.now(),
      hora: "08:00",
      materia: "Nova Disciplina",
      cor: "#3b82f6"
    };

    const novasAulas = [...(dia.aulas || []), nova];
    
    try {
      await api.updateDia(diaId, novasAulas);
      setDias(prev => prev.map(d => d.id === diaId ? { ...d, aulas: novasAulas } : d));
      return nova; 
    } catch (err) {
      console.error("Erro ao adicionar aula:", err);
      return null;
    }
  };

  const salvarEdicao = async (diaId: string, aulaEditada: Aula) => {
    const dia = dias.find(d => d.id === diaId);
    if (!dia) return;
    const novasAulas = dia.aulas.map(a => a.id === aulaEditada.id ? aulaEditada : a);
    await api.updateDia(diaId, novasAulas);
    setDias(prev => prev.map(d => d.id === diaId ? { ...d, aulas: novasAulas } : d));
  };

  const deletarAula = async (diaId: string, aulaId: number) => {
    const dia = dias.find(d => d.id === diaId);
    if (!dia) return;
    const novasAulas = dia.aulas.filter(a => a.id !== aulaId);
    await api.updateDia(diaId, novasAulas);
    setDias(prev => prev.map(d => d.id === diaId ? { ...d, aulas: novasAulas } : d));
  };

  return { 
    dias, 
    status, 
    totalAulas, 
    salvarEdicao, 
    deletarAula, 
    adicionarAula, 
    carregarDados 
  };
}