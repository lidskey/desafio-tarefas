export const PRIORIDADES = ['baixa', 'media', 'alta'] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

// Cor de preenchimento de cada degrau do termômetro, da mais calma à mais urgente.
export const NIVEL_COR = ['bg-color4', 'bg-color2', 'bg-color1'] as const;

export const PRIORIDADE_INK: Record<Prioridade, string> = {
  baixa: 'text-foreground/70',
  media: 'text-color2-ink',
  alta: 'text-color1-ink',
};
