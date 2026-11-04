import { TRPCError } from '@trpc/server';
import { notFound } from 'next/navigation';
import { FormTarefa } from '@/app/_components/form-tarefa';
import { caller } from '@/server/trpc/server';

export const dynamic = 'force-dynamic';

export default async function EditarTarefa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // no Next 15, params é uma Promise

  let tarefa;
  try {
    tarefa = await caller.tarefa.buscarPorId({ id });
  } catch (err) {
    if (err instanceof TRPCError && ['NOT_FOUND', 'BAD_REQUEST'].includes(err.code)) notFound();
    throw err;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Editar tarefa</h1>
      <FormTarefa tarefa={tarefa} />
    </main>
  );
}