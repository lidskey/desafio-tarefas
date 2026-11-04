// src/trpc/server.tsx
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { appRouter } from '@/server/trpc/routers/_app';
import { makeQueryClient } from './query-client';

// Um QueryClient por requisição
export const getQueryClient = cache(makeQueryClient);

// Para prefetch em Server Components (chama o router direto, sem HTTP)
export const trpc = createTRPCOptionsProxy({
  ctx: () => ({}),
  router: appRouter,
  queryClient: getQueryClient,
});

// Para chamadas diretas no servidor (ex.: carregar a tarefa na página de edição)
export const caller = appRouter.createCaller({});