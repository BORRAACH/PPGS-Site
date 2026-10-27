import { useCart } from "../cart/useCart";
import { formatBRL } from "../lib/money";

export interface Opcao {
  label: string;
  preco: number;
}

interface Props {
  id: string;
  nome: string;
  descricao?: string;
  opcoes: Opcao[];
}

/** Card genérico: um botão de "adicionar" por opção (tamanho, pão, etc.). */
export default function ProductCard({ id, nome, descricao, opcoes }: Props) {
  const { add } = useCart();

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="font-semibold">{nome}</h3>
        {descricao && <p className="text-sm text-stone-500">{descricao}</p>}
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {opcoes.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() =>
              add({
                key: `${id}-${o.label}`,
                nome,
                opcao: o.label || undefined,
                preco: o.preco,
              })
            }
            className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800"
          >
            {o.label && `${o.label} · `}
            {formatBRL(o.preco)} +
          </button>
        ))}
      </div>
    </li>
  );
}
