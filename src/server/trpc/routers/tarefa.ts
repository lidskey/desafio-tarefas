// src/server/trpc/routers/tarefa.ts
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { tarefaInputSchema } from '@/lib/schemas';
import { tarefas, type Tarefa } from '@/server/store';
import { publicProcedure, router } from '../init';

const idSchema = z.object({ id: z.string().uuid('ID inválido') });

function buscarOuFalhar(id: string): Tarefa {
  const tarefa = tarefas.get(id);
  if (!tarefa) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Tarefa não encontrada' });
  }
  return tarefa;
}

export const tarefaRouter = router({
  // Paginação por cursor (timestamp da última tarefa da página) -> usado no infinite scroll
  listar: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        cursor: z.number().nullish(),
      }),
    )
    .query(({ input }) => {
      const ordenadas = [...tarefas.values()].sort(
        (a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime(),
      );
      const filtradas = input.cursor
        ? ordenadas.filter((t) => t.dataCriacao.getTime() < input.cursor!)
        : ordenadas;

      // Busca 1 a mais para saber se existe próxima página
      const items = filtradas.slice(0, input.limit + 1);
      let nextCursor: number | null = null;
      if (items.length > input.limit) {
        items.pop();
        nextCursor = items.at(-1)!.dataCriacao.getTime();
      }
      return { items, nextCursor };
    }),

  buscarPorId: publicProcedure.input(idSchema).query(({ input }) => buscarOuFalhar(input.id)),

  criar: publicProcedure.input(tarefaInputSchema).mutation(({ input }) => {
    const tarefa: Tarefa = {
      id: crypto.randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao || undefined,
      prioridade: input.prioridade,
      dataCriacao: new Date(),
    };
    tarefas.set(tarefa.id, tarefa);
    return tarefa;
  }),

  atualizar: publicProcedure
    .input(idSchema.merge(tarefaInputSchema))
    .mutation(({ input }) => {
      const atual = buscarOuFalhar(input.id);
      const atualizada = {
        ...atual,
        titulo: input.titulo,
        descricao: input.descricao || undefined,
        prioridade: input.prioridade,
      };
      tarefas.set(atual.id, atualizada);
      return atualizada;
    }),

  deletar: publicProcedure.input(idSchema).mutation(({ input }) => {
    buscarOuFalhar(input.id);
    tarefas.delete(input.id);
    return { id: input.id };
  }),
});