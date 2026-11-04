// src/app/_components/form-tarefa.tsx
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type Prioridade } from '@/lib/prioridade';
import { tarefaInputSchema } from '@/lib/schemas';
import { useTRPC } from '@/server/trpc/client';
import { TermometroPrioridade } from './termometro-prioridade';


type Props = {
  tarefa?: { id: string; titulo: string; descricao?: string; prioridade?: Prioridade };
};

export function FormTarefa({ tarefa }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const editando = !!tarefa;

  const [titulo, setTitulo] = useState(tarefa?.titulo ?? '');
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? '');
  const [prioridade, setPrioridade] = useState<Prioridade>(tarefa?.prioridade ?? 'media');
  const [erros, setErros] = useState<{ titulo?: string; descricao?: string; geral?: string }>({});

  const aoSucesso = async () => {
    await queryClient.invalidateQueries(trpc.tarefa.pathFilter());
    router.push(`/?ok=${editando ? 'atualizada' : 'criada'}`);
  };
  const aoErro = (err: { message: string }) => setErros({ geral: err.message });

  const criar = useMutation(trpc.tarefa.criar.mutationOptions({ onSuccess: aoSucesso, onError: aoErro }));
  const atualizar = useMutation(trpc.tarefa.atualizar.mutationOptions({ onSuccess: aoSucesso, onError: aoErro }));
  const salvando = criar.isPending || atualizar.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validação no front com o MESMO schema do backend
    const resultado = tarefaInputSchema.safeParse({ titulo, descricao: descricao || undefined, prioridade });
    if (!resultado.success) {
      const novos: typeof erros = {};
      for (const issue of resultado.error.issues) {
        novos[issue.path[0] as 'titulo' | 'descricao'] = issue.message;
      }
      setErros(novos);
      return;
    }
    setErros({});
    if (editando) atualizar.mutate({ id: tarefa.id, ...resultado.data });
    else criar.mutate(resultado.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {erros.geral && (
        <div role="alert" className="rounded-md bg-color2/15 p-3 text-sm text-color1-ink">
          {erros.geral}
        </div>
      )}

      <div>
        <label htmlFor="titulo" className="block text-sm font-medium">Título *</label>
        <input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          aria-invalid={!!erros.titulo}
          className="mt-1 w-full rounded-md border border-color3 bg-surface p-2 text-sm outline-none transition-colors focus:border-color1"
        />
        {erros.titulo && <p className="mt-1 text-sm text-color1-ink">{erros.titulo}</p>}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium">Descrição</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-color3 bg-surface p-2 text-sm outline-none transition-colors focus:border-color1"
        />
        {erros.descricao && <p className="mt-1 text-sm text-color1-ink">{erros.descricao}</p>}
      </div>

      <div>
        <span className="block text-sm font-medium">Prioridade</span>
        <div className="mt-2">
          <TermometroPrioridade valor={prioridade} aoAlterar={setPrioridade} />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="cursor-pointer rounded-md bg-color1 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:brightness-95 disabled:opacity-50"
        >
          {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Criar tarefa'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md cursor-pointer px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-color4/50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}