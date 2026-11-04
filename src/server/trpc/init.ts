// src/server/trpc/init.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
  // Expõe os erros de validação de forma estruturada para o front
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodIssues: error.cause instanceof ZodError ? error.cause.issues : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;