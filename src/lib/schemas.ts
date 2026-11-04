import { z } from 'zod';
import { PRIORIDADES } from './prioridade';

export const tarefaInputSchema = z.object({
  titulo: z.string().trim().min(1, 'Escreva o título da tarefa').max(100, 'Máximo de 100 caracteres'),
  descricao: z.string().trim().max(500, 'Máximo de 500 caracteres').optional(),
  prioridade: z.enum(PRIORIDADES).default('media'),
});

export type TarefaInput = z.infer<typeof tarefaInputSchema>;