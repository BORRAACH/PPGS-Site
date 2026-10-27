interface Props {
  qtd: number;
  onChange: (qtd: number) => void;
  nome: string;
}

const botao =
  "flex size-11 items-center justify-center rounded border-2 border-carvao-900 bg-creme-50 text-xl font-bold active:bg-areia-300";

export default function Stepper({ qtd, onChange, nome }: Props) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Quantidade de ${nome}`}>
      <button
        type="button"
        className={botao}
        onClick={() => onChange(qtd - 1)}
        aria-label={qtd === 1 ? `Remover ${nome}` : `Diminuir ${nome}`}
      >
        {qtd === 1 ? (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
          </svg>
        ) : (
          "−"
        )}
      </button>
      <span className="w-8 text-center text-lg font-bold tabular-nums" aria-live="polite">
        {qtd}
      </span>
      <button type="button" className={botao} onClick={() => onChange(qtd + 1)} aria-label={`Aumentar ${nome}`}>
        +
      </button>
    </div>
  );
}
