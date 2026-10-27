import { Link, useLocation } from "react-router";
import { useCart } from "../cart/useCart";
import { loja } from "../config/loja";
import { formatBRL } from "../lib/money";

/** Barra fixa no rodapé: total sempre visível. A única animação é o "pop" do contador ao adicionar. */
export default function CartBar() {
  const { count, total } = useCart();
  const { pathname } = useLocation();

  if (count === 0 || pathname === "/carrinho") return null;
  const falta = loja.pedidoMinimo - total;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ouro-300 bg-carvao-900 pb-[env(safe-area-inset-bottom)] text-creme-50">
      {falta > 0 && (
        <p className="bg-carvao-800 px-4 py-1 text-center text-xs">
          Faltam {formatBRL(falta)} para o mínimo de entrega (retirada não tem mínimo)
        </p>
      )}
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            key={count}
            className="flex size-9 animate-pop items-center justify-center rounded-full bg-ouro-300 font-bold text-carvao-900"
          >
            {count}
          </span>
          <div className="leading-tight">
            <p className="text-xs text-taupe-400">{count === 1 ? "item" : "itens"} · total</p>
            <p className="font-display text-xl">{formatBRL(total)}</p>
          </div>
        </div>
        <Link
          to="/carrinho"
          className="flex min-h-12 items-center rounded bg-ouro-300 px-5 font-bold text-carvao-900 active:bg-ouro-100"
        >
          Ver pedido →
        </Link>
      </div>
    </div>
  );
}
