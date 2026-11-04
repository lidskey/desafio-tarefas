import { getQueryClient, trpc } from '@/server/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ListaTarefas } from './_components/lista-tarefas';


export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    trpc.tarefa.listar.infiniteQueryOptions(
      { limit: 10 },
      { getNextPageParam: (last) => last.nextCursor },
    ),
  );

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Tarefas</h1>
        <Link
          href="/tarefas/nova"
          className="inline-flex items-center gap-1.5 rounded-md bg-color1 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:brightness-95"
        >
          <Plus className="size-4" aria-hidden />
          Nova tarefa
        </Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ListaTarefas mensagemInicial={ok ? `Tarefa ${ok} com sucesso!` : undefined} />
      </HydrationBoundary>
    </main>
  );
}