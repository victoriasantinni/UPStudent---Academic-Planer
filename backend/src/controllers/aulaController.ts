import { Response } from 'express';
import { CustomRequest } from '../middlewares/authMiddleware.js';
import prisma from '../database/prisma.js';

export const getDaysWithAulas = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Usuário não autenticado.' });
      return;
    }

    const aulas = await prisma.aula.findMany({
      where: { userId: String(userId) },
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
    res.status(500).json({ error: 'Erro ao buscar o cronograma.' });
  }
};

export const updateDiaAulas = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { diaId } = req.params;
    const { aulas } = req.body; 

    if (!userId) {
      res.status(401).json({ error: 'Usuário não identificado.' });
      return;
    }

    // Deleta as aulas antigas deste dia para este usuário
    await prisma.aula.deleteMany({ 
      where: { 
        userId: String(userId), 
        diaId: String(diaId) 
      } 
    });

    // Se houver novas aulas, cria-as
    if (aulas && Array.isArray(aulas)) {
      const dataToCreate = aulas.map((aula: any) => ({
        materia: String(aula.materia || ""),
        horario: String(aula.horario || aula.hora || ""),
        diaId: String(diaId),
        userId: String(userId),
      }));

      // Usando 'as any' para contornar a validação estrita do Prisma no build
      await (prisma.aula as any).createMany({ data: dataToCreate });
    }

    res.json({ message: 'Atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar.' });
  }
};