// src/server/trpc/routers/_app.ts
import { router } from '../init';
import { tarefaRouter } from './tarefa';

export const appRouter = router({ tarefa: tarefaRouter });
export type AppRouter = typeof appRouter;