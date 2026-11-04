// src/app/tarefas/nova/page.tsx
import { FormTarefa } from '@/app/_components/form-tarefa';

export default function NovaTarefa() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nova tarefa</h1>
      <FormTarefa />
    </main>
  );
}