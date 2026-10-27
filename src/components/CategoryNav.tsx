import { useEffect, useRef } from "react";
import { CATEGORIAS, type CategoriaId } from "../lib/categorias";

interface Props {
  ids: CategoriaId[];
  ativa: CategoriaId;
  onSelect: (id: CategoriaId) => void;
}

export default function CategoryNav({ ids, ativa, onSelect }: Props) {
  const nav = useRef<HTMLElement>(null);

  // mantém o chip ativo à vista durante o scroll-spy
  useEffect(() => {
    const el = nav.current;
    const chip = el?.querySelector<HTMLElement>('[aria-current="true"]');
    if (el && chip) {
      el.scrollTo({ left: chip.offsetLeft - el.clientWidth / 2 + chip.clientWidth / 2 });
    }
  }, [ativa]);

  return (
    <nav
      ref={nav}
      aria-label="Categorias do cardápio"
      className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b-2 border-carvao-900 bg-areia-100 px-4 py-2 [scrollbar-width:none]"
    >
      {ids.map((id) => {
        const ativo = id === ativa;
        return (
          <button
            key={id}
            type="button"
            aria-current={ativo}
            onClick={() => onSelect(id)}
            className={`min-h-11 shrink-0 rounded border-2 border-carvao-900 px-4 font-semibold whitespace-nowrap ${
              ativo ? CATEGORIAS[id].banda : "bg-creme-50 text-carvao-900"
            }`}
          >
            {CATEGORIAS[id].titulo}
          </button>
        );
      })}
    </nav>
  );
}
