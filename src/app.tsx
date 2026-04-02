import React, { useState } from 'react';
import { useGrade } from './hooks/useGrade';
import { Button } from './components/Button';
import { Aula } from './types';

const HORARIOS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function App() {
  const { dias, status, totalAulas, salvarEdicao, deletarAula, adicionarAula, carregarDados } = useGrade();
  const [editando, setEditando] = useState<{diaId: string, aula: Aula} | null>(null);

  const handleNovaAula = async (diaId: string) => {
    const nova = await adicionarAula(diaId);
    if (nova) {
      setEditando({ diaId, aula: nova });
    }
  };

  if (status === 'error') return (
    <div className="min-h-screen bg-stone-300 flex flex-col items-center justify-center p-6 text-stone-900">
       <h2 className="text-xl font-serif mb-4">Erro na conexão com a biblioteca 📚</h2>
       <Button onClick={carregarDados}>Recarregar Grade</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-300 text-stone-800 font-sans selection:bg-yellow-200">
      
      <header className="bg-stone-200 border-b-2 border-stone-300 px-6 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight">
              UP<span className="text-blue-700 underline decoration-yellow-400 decoration-4">STUDENT</span>
            </h1>
            <p className="text-xs font-medium text-stone-600 uppercase tracking-widest mt-1">Planner Acadêmico • Salvador, BA</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right border-r-2 border-stone-300 pr-4">
              <span className="block text-[10px] font-bold text-stone-500 uppercase">Aulas Confirmadas</span>
              <span className="text-2xl font-serif font-bold text-slate-800">{totalAulas}</span>
            </div>
            <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-serif italic text-xl shadow-inner border-2 border-white/50">
              V.S
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {dias.map(dia => (
            <section key={dia.id} className="relative">
              <div className="bg-white border-2 border-stone-200 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] flex flex-col min-h-[500px] overflow-hidden">
                <header className="bg-stone-50 border-b-2 border-stone-200 p-4 flex justify-between items-center">
                  <h2 className="font-serif font-black text-slate-700 uppercase text-xs tracking-tighter">{dia.name}</h2>
                  <button 
                    onClick={() => handleNovaAula(dia.id)}
                    className="w-7 h-7 rounded-md border-2 border-blue-700 text-blue-700 flex items-center justify-center font-bold hover:bg-blue-700 hover:text-white transition-all active:scale-90"
                    title="Adicionar nova aula"
                  > + </button>
                </header>
                
                <div className="p-4 space-y-4 flex-1 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat">
                  {dia.aulas.length === 0 ? (
                    <div className="py-24 text-center">
                      <p className="text-[10px] font-serif italic text-stone-400">Sem compromissos agendados</p>
                    </div>
                  ) : (
                    dia.aulas.map(aula => (
                      <article 
                        key={aula.id}
                        onClick={() => setEditando({ diaId: dia.id, aula })}
                        className="bg-white p-4 rounded-md border-2 border-stone-200 cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all relative group"
                      >
                        <div 
                          className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full" 
                          style={{ backgroundColor: aula.cor }}
                        />
                        <time className="text-[10px] text-stone-500 font-bold font-mono tracking-tight">{aula.hora}</time>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight mt-1 group-hover:text-blue-700">{aula.materia}</h3>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      {editando && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#FDFCF8] p-10 rounded-xl border-2 border-stone-300 w-full max-w-md shadow-2xl rotate-1 scale-in">
            <header className="mb-8 border-b-2 border-dashed border-stone-300 pb-4">
              <h2 className="text-2xl font-serif font-black text-slate-800">Ficha de <span className="text-blue-700">Disciplina</span></h2>
            </header>
            
            <form onSubmit={(e) => { e.preventDefault(); salvarEdicao(editando.diaId, editando.aula); setEditando(null); }} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase block mb-1 tracking-widest">Matéria / Disciplina</label>
                <input 
                  className="w-full bg-white p-4 rounded-md border-2 border-stone-200 text-slate-900 font-bold outline-none focus:border-blue-700 transition-colors"
                  value={editando.aula.materia}
                  onChange={e => setEditando({...editando, aula: {...editando.aula, materia: e.target.value}})}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase block mb-1 tracking-widest">Horário do Bloco</label>
                <select 
                  className="w-full bg-white p-4 rounded-md border-2 border-stone-200 text-slate-900 font-bold outline-none cursor-pointer appearance-none"
                  value={editando.aula.hora}
                  onChange={e => setEditando({...editando, aula: {...editando.aula, hora: e.target.value}})}
                >
                  {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button type="submit" className="w-full bg-blue-700 text-white font-bold py-4 rounded-md hover:bg-blue-800 shadow-md transition-colors active:scale-95">
                  Atualizar Grade
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => { deletarAula(editando.diaId, editando.aula.id); setEditando(null); }} className="font-bold text-red-700 border-2 border-red-100 py-2.5 rounded-md hover:bg-red-50 transition-colors">
                    Remover
                  </button>
                  <button type="button" onClick={() => setEditando(null)} className="font-bold text-stone-500 py-2.5 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}