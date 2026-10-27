import { Link, useLocation } from "react-router";
import { loja } from "../config/loja";
import { formatBRL } from "../lib/money";
import StatusLoja from "./StatusLoja";

export default function Header() {
  const { pathname } = useLocation();
  const emFluxo = pathname === "/carrinho" || pathname.startsWith("/pizza/");
  const noCardapio = pathname === "/cardapio";

  return (
    <header className="bg-carvao-900 text-creme-50">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4">
        <Link to="/" className="font-display text-3xl leading-none">
          {loja.nome}
        </Link>
        {emFluxo ? (
          <Link to="/cardapio" className="rounded px-2 py-2 text-sm font-semibold underline underline-offset-4">
            ← Voltar ao cardápio
          </Link>
        ) : (
          <StatusLoja />
        )}
      </div>
      {noCardapio && (
        <p className="border-t border-umbre-700 bg-carvao-800 px-4 py-2 text-center text-sm">
          Entrega <b>{formatBRL(loja.taxaEntrega)}</b> · Pedido mínimo para entrega{" "}
          <b>{formatBRL(loja.pedidoMinimo)}</b> · Retirada sem taxa
        </p>
      )}
    </header>
  );
}
