// src/server/store.ts
import { PRIORIDADES, type Prioridade } from '@/lib/prioridade';

export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: Prioridade;
  dataCriacao: Date;
};

// Guardar no globalThis evita que o hot reload do Next zere a lista em dev.
const g = globalThis as unknown as { __tarefas?: Map<string, Tarefa> };

function seed() {
  const map = new Map<string, Tarefa>();
  // Dados fictícios para demonstrar o infinite scroll
  for (let i = 1; i <= 30; i++) {
    const id = crypto.randomUUID();
    map.set(id, {
      id,
      titulo: `Tarefa de exemplo ${i}`,
      descricao: i % 3 === 0 ? undefined : `Descrição da tarefa ${i}`,
      prioridade: PRIORIDADES[i % PRIORIDADES.length],
      dataCriacao: new Date(Date.now() - i * 60_000), // 1 min de diferença entre cada
    });
  }
  return map;
}

export const tarefas = (g.__tarefas ??= seed());