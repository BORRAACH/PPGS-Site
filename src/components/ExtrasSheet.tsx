import { useState } from "react";
import { useCart } from "../cart/useCart";
import type { Item } from "../data/cardapio";
import type { Opcao } from "../lib/itens";
import { formatBRL, parsePreco } from "../lib/money";
import Sheet from "./Sheet";

interface Props {
  id: string;
  nome: string;
  descricao?: string;
  /** Escolha obrigatória (tamanho do açaí, tipo de pão...) */
  bases: Opcao[];
  rotuloBase: string;
  extras: Item[];
  onClose: () => void;
}

/** Sheet genérica: uma escolha obrigatória + adicionais opcionais. Usada por lanches e açaí. */
export default function ExtrasSheet({ id, nome, descricao, bases, rotuloBase, extras, onClose }: Props) {
  const { add } = useCart();
  const [baseIdx, setBaseIdx] = useState(0);
  const [marcados, setMarcados] = useState<string[]>([]);

  const base = bases[baseIdx];
  const sel = extras.filter((e) => marcados.includes(e.nome));
  const total = base.preco + sel.reduce((s, e) => s + parsePreco(e.valor), 0);

  function alternar(n: string) {
    setMarcados((m) => (m.includes(n) ? m.filter((x) => x !== n) : [...m, n]));
  }

  function confirmar() {
    add({
      key: [id, base.label, [...marcados].sort().join(",")].join("|"),
      nome,
      opcao: base.label,
      detalhes: sel.map((e) => `+ ${e.nome}`),
      preco: total,
    });
    onClose();
  }

  return (
    <Sheet
      titulo={nome}
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={confirmar}
          className="flex min-h-12 w-full items-center justify-between rounded border-2 border-carvao-900 bg-ouro-300 px-4 font-bold text-carvao-900 active:bg-ouro-100"
        >
          <span>Adicionar ao pedido</span>
          <span className="font-display text-xl">{formatBRL(total)}</span>
        </button>
      }
    >
      {descricao && <p className="text-sm text-umbre-700">{descricao}</p>}

      <fieldset className="mt-4">
        <legend className="mb-2 font-bold">{rotuloBase}</legend>
        <div className="flex flex-col gap-2">
          {bases.map((b, i) => (
            <label
              key={b.label}
              className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded border-2 border-carvao-900 px-3 font-semibold ${
                i === baseIdx ? "bg-carvao-900 text-creme-50" : "bg-creme-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="base"
                  checked={i === baseIdx}
                  onChange={() => setBaseIdx(i)}
                  className="size-5 accent-ouro-300"
                />
                {b.label}
              </span>
              <span className="font-display text-lg font-normal">{formatBRL(b.preco)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {extras.length > 0 && (
        <fieldset className="mt-4">
          <legend className="mb-2 font-bold">Adicionais</legend>
          <ul className="flex flex-col divide-y divide-taupe-400">
            {extras.map((e) => (
              <li key={e.nome}>
                <label className="flex min-h-11 items-center gap-3 py-1">
                  <input
                    type="checkbox"
                    checked={marcados.includes(e.nome)}
                    onChange={() => alternar(e.nome)}
                    className="size-6 accent-brasa-500"
                  />
                  <span className="flex-1 font-semibold">{e.nome}</span>
                  <span className="text-sm">+ {formatBRL(parsePreco(e.valor))}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </Sheet>
  );
}
