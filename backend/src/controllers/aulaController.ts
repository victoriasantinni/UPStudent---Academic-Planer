import { Response } from 'express';
import { CustomRequest } from '../middlewares/authMiddleware';
import prisma from '../database/prisma';

export const getDaysWithAulas = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // 🛡️ Segurança do TS: Garante que o userId existe antes de passá-lo para o Prisma
    if (!userId) {
      res.status(401).json({ error: 'Usuário não autenticado.' });
      return;
    }

    const aulas = await prisma.aula.findMany({
      where: { userId },
    });

    const diasSemana = [
      { id: 'segunda', name: 'Segunda-feira' },
      { id: 'terça', name: 'Terça-feira' },
      { id: 'quarta', name: 'Quarta-feira' },
      { id: 'quinta-feira', name: 'Quinta-feira' },
      { id: 'sexta', name: 'Sexta-feira' },
    ];
    
    const jsonServerAdapter = diasSemana.map((dia) => ({
      id: dia.id,
      name: dia.name, 
      aulas: aulas
        .filter((aula) => aula.diaId === dia.id)
        .map((aula) => ({
          id: aula.id,
          materia: aula.materia,
          hora: aula.horario, 
          cor: '#3b82f6',     
        })),
    }));

    res.json(jsonServerAdapter);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o cronograma de estudos.' });
  }
};

export const updateDiaAulas = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { diaId } = req.params;
    const { aulas } = req.body; 

    // 🛡️ Movido para o topo! A checagem precisa acontecer ANTES de rodar o deleteMany
    if (!userId) {
      res.status(401).json({ error: 'Usuário não identificado.' });
      return;
    }

    await prisma.aula.deleteMany({
      where: { userId, diaId },
    });

    if (aulas && Array.isArray(aulas) && aulas.length > 0) {
      await prisma.aula.createMany({
        data: aulas.map((aula: any) => ({
          materia: aula.materia,
          horario: aula.hora || aula.horario, 
          diaId,
          userId: userId,
        })),
      });
    }

    res.json({ message: `Dia ${diaId} atualizado com sucesso no PostgreSQL!` });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar modificações do card.' });
  }
};