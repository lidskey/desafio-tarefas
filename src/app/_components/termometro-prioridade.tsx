import { NIVEL_COR, PRIORIDADE_INK, PRIORIDADE_LABEL, PRIORIDADES, type Prioridade } from '@/lib/prioridade';

type Props = {
  valor: Prioridade;
  aoAlterar?: (prioridade: Prioridade) => void;
};

export function TermometroPrioridade({ valor, aoAlterar }: Props) {
  const nivelAtual = PRIORIDADES.indexOf(valor);
  const interativo = !!aoAlterar;

  return (
    <div className="flex items-center gap-1.5">
      {PRIORIDADES.map((p, i) => {
        const preenchido = i <= nivelAtual;

        if (interativo) {
          return (
            <button
              key={p}
              type="button"
              title={PRIORIDADE_LABEL[p]}
              aria-pressed={valor === p}
              onClick={() => aoAlterar(p)}
              className={`size-5 cursor-pointer rounded-sm border transition-colors hover:brightness-95 ${
                preenchido ? `${NIVEL_COR[i]} border-transparent` : 'border-color3'
              }`}
            />
          );
        }

        return (
          <span
            key={p}
            aria-hidden
            className={`size-2.5 rounded-sm ${preenchido ? NIVEL_COR[i] : 'border border-color3'}`}
          />
        );
      })}
      <span className={`${interativo ? 'text-sm' : 'text-xs'} font-medium ${PRIORIDADE_INK[valor]}`}>
        {PRIORIDADE_LABEL[valor]}
      </span>
    </div>
  );
}
