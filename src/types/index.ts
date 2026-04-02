export interface Aula {
  id: number;
  hora: string;
  materia: string;
  cor: string;
}

export interface DiaEstudo {
  id: string;
  name: string;
  aulas: Aula[];
}

export type NovaAula = Omit<Aula, 'id'>;
export type EdicaoAula = Partial<Aula>;