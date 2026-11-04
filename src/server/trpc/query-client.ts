// src/trpc/query-client.ts
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000 }, // evita refetch logo após a hidratação
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (q) => defaultShouldDehydrateQuery(q) || q.state.status === 'pending',
      },
      hydrate: { deserializeData: superjson.deserialize },
    },
  });
}