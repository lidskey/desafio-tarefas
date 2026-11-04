'use client';
import { useTRPC } from '@/server/trpc/client';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Loader2, Pencil, Trash2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { TermometroPrioridade } from './termometro-prioridade';

type Feedback = { tipo: 'sucesso' | 'erro'; msg: string } | null;
type Alvo = { id: string; titulo: string } | null;

export function ListaTarefas({ mensagemInicial }: { mensagemInicial?: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<Feedback>(
    mensagemInicial ? { tipo: 'sucesso', msg: mensagemInicial } : null,
  );
  const [alvo, setAlvo] = useState<Alvo>(null);

  // Mesma chave do prefetch -> usa os dados vindos do SSR
  const { data, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    trpc.tarefa.listar.infiniteQueryOptions(
      { limit: 10 },
      { getNextPageParam: (last: { nextCursor: number | null }) => last.nextCursor },
    ),
  );

  const deletar = useMutation(
    trpc.tarefa.deletar.mutationOptions({
      onSuccess: async () => {
        setAlvo(null);
        setFeedback({ tipo: 'sucesso', msg: 'Tarefa excluída.' });
        await queryClient.invalidateQueries(trpc.tarefa.pathFilter());
      },
      onError: (err) => {
        setAlvo(null);
        setFeedback({ tipo: 'erro', msg: err.message });
      },
    }),
  );

  // Fecha o popup de confirmação com Esc
  useEffect(() => {
    if (!alvo) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setAlvo(null);
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [alvo]);

  const sentinelaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Some sozinho depois de 4s
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  if (error) return <p className="text-color1-ink">Erro ao carregar tarefas: {error.message}</p>;

  const lista = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <>
      {feedback && (
        <div
          role="status"
          className={`mb-4 rounded-md p-3 text-sm ${feedback.tipo === 'sucesso' ? 'bg-color4/50 text-foreground' : 'bg-color2/15 text-color1-ink'}`}
        >
          {feedback.msg}
        </div>
      )}

      {lista.length === 0 && (
        <p className="rounded-md border border-dashed border-color3 bg-surface p-6 text-center text-sm text-foreground/60">
          Nenhuma tarefa ainda.
        </p>
      )}

      <ul className="space-y-3">
        {lista.map((t) => {
          const excluindo = deletar.isPending && deletar.variables?.id === t.id;
          return (
            <li
              key={t.id}
              className="rounded-md border border-color3 bg-surface p-5 transition-colors hover:border-color2"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold leading-snug text-foreground">{t.titulo}</h2>
                <TermometroPrioridade valor={t.prioridade} />
              </div>
              {t.descricao && (
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{t.descricao}</p>
              )}
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground/50">
                <CalendarDays className="size-3.5" aria-hidden />
                {t.dataCriacao.toLocaleString('pt-BR')}
              </p>

              <div className="mt-4 flex gap-5 border-t border-color3 pt-3 text-sm">
                <Link
                  href={`/tarefas/${t.id}/editar`}
                  className="inline-flex items-center gap-1.5 text-color2-ink hover:underline"
                >
                  <Pencil className="size-4" aria-hidden />
                  Editar
                </Link>
                <button
                  onClick={() => setAlvo({ id: t.id, titulo: t.titulo })}
                  disabled={excluindo}
                  className="inline-flex items-center gap-1.5 text-color1-ink cursor-pointer hover:underline disabled:opacity-50"
                >
                  {excluindo ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="cursor-pointer size-4" aria-hidden />}
                  {excluindo ? 'Excluindo…' : 'Excluir'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div ref={sentinelaRef} className="py-6 text-center text-sm text-foreground/50">
        {isFetchingNextPage ? 'Carregando mais…' : !hasNextPage && lista.length > 0 && 'Fim da lista'}
      </div>

      {alvo && (
        <div
          role="presentation"
          onClick={() => setAlvo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmacao"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-md border border-color3 bg-surface p-6 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-color2/15 text-color1-ink">
                <TriangleAlert className="size-5" aria-hidden />
              </span>
              <div>
                <h2 id="titulo-confirmacao" className="font-semibold text-foreground">
                  Excluir tarefa?
                </h2>
                <p className="mt-1 text-sm text-foreground/70">
                  Tem certeza que deseja excluir &quot;{alvo.titulo}&quot;? Essa ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAlvo(null)}
                className="rounded-md px-4 py-2 text-sm font-medium cursor-pointer text-foreground/70 transition-colors hover:bg-color4/50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => deletar.mutate({ id: alvo.id })}
                disabled={deletar.isPending}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-md bg-color1 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:brightness-95 disabled:opacity-50"
              >
                {deletar.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Trash2 className="size-4" aria-hidden />
                )}
                {deletar.isPending ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}