import { useEffect, useState } from "react";
import { useCart } from "../cart/useCart";
import { esgotados } from "../config/loja";
import { CATEGORIAS } from "../lib/categorias";
import type { ItemMenu } from "../lib/itens";
import { formatNum } from "../lib/money";
import Foto from "./Foto";

interface Props {
  item: ItemMenu;
  /** Chamado para itens que precisam de escolhas (tamanho, meio a meio, adicionais) */
  onPersonalizar: (item: ItemMenu) => void;
}

export default function ItemRow({ item, onPersonalizar }: Props) {
  const { add } = useCart();
  const [adicionado, setAdicionado] = useState(false);
  const esgotado = esgotados.has(item.id);
  const simples = item.tipo === "simples";
  const cat = CATEGORIAS[item.categoria];

  useEffect(() => {
    if (!adicionado) return;
    const t = setTimeout(() => setAdicionado(false), 1200);
    return () => clearTimeout(t);
  }, [adicionado]);

  function acionar() {
    if (simples) {
      add({ key: item.id, nome: item.nome, preco: item.precos[0].preco });
      setAdicionado(true);
    } else {
      onPersonalizar(item);
    }
  }

  return (
    <li className={`flex gap-3 border-b-2 border-dashed border-taupe-400 px-4 py-4 ${esgotado ? "opacity-60" : ""}`}>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold leading-snug">
          {item.nome}
          {esgotado && (
            <span className="ml-2 rounded bg-carvao-900 px-1.5 py-0.5 align-middle text-xs font-semibold text-creme-50">
              Esgotado
            </span>
          )}
        </h3>
        {item.descricao && <p className="mt-0.5 text-sm text-umbre-700">{item.descricao}</p>}
        <p className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 ${cat.tinta}`}>
          {item.precos.map((p) => (
            <span key={p.label} className="whitespace-nowrap">
              {p.label && <span className="mr-1 text-sm font-semibold text-umbre-700">{p.label}</span>}
              <span className="font-display text-xl">
                <span className="mr-0.5 font-sans text-xs font-bold">R$</span>
                {formatNum(p.preco)}
              </span>
            </span>
          ))}
        </p>
      </div>

      <div className="relative shrink-0 self-start">
        <Foto id={item.id} nome={item.nome} categoria={item.categoria} className="size-24 rounded" />
        <button
          type="button"
          disabled={esgotado}
          onClick={acionar}
          aria-label={
            esgotado
              ? `${item.nome} esgotado`
              : simples
                ? `Adicionar ${item.nome}`
                : `Escolher ${item.nome}`
          }
          className={`absolute -right-2 -bottom-2 flex size-12 items-center justify-center rounded border-2 border-carvao-900 text-2xl font-bold shadow-[2px_2px_0_var(--color-carvao-900)] transition-colors disabled:cursor-not-allowed disabled:bg-areia-300 disabled:text-umbre-600 disabled:shadow-none ${
            adicionado ? "bg-oliva-500 text-white" : "bg-ouro-300 text-carvao-900"
          }`}
        >
          {esgotado ? "–" : adicionado ? "✓" : "+"}
        </button>
      </div>
    </li>
  );
}
