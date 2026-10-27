import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  titulo: string;
  /** Ex.: "Passo 2 de 3" */
  passo?: string;
  /** Se informado, mostra o botão de voltar ao lado do título */
  onBack?: () => void;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Bottom-sheet no mobile, modal centralizado no desktop.
 * Usa <dialog>: foco preso, Esc fecha e o resto da página fica inerte.
 * Monte apenas quando aberto (o estado interno reinicia a cada abertura).
 */
export default function Sheet({ titulo, passo, onBack, onClose, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current!;
    if (!d.open) d.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      d.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onCancel={(e) => {
        // Esc: o desmonte (cleanup do efeito) fecha o dialog; não emitimos "close" a partir do cleanup
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none flex-col overflow-hidden rounded-t-2xl bg-creme-50 p-0 text-carvao-900 backdrop:bg-carvao-900/60 open:flex sm:m-auto sm:max-w-lg sm:rounded-2xl"
    >
      <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-taupe-400 px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded text-2xl"
          >
            ‹
          </button>
        )}
        <div className="min-w-0 flex-1">
          {passo && <p className="text-xs font-semibold uppercase tracking-wide text-umbre-700">{passo}</p>}
          <h2 className="font-display text-2xl leading-tight">{titulo}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded text-2xl"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">{children}</div>
      <div className="border-t-2 border-carvao-900 bg-areia-200 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {footer}
      </div>
    </dialog>
  );
}
