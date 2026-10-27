import { useMemo } from "react";
import { Link } from "react-router";
import Foto from "../components/Foto";
import StatusLoja from "../components/StatusLoja";
import { useCart } from "../cart/useCart";
import { combos } from "../config/combos";
import { loja } from "../config/loja";
import { CATEGORIAS, ORDEM } from "../lib/categorias";
import { montarCardapio } from "../lib/itens";
import { formatBRL } from "../lib/money";

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const MAX_PROMOS_HOME = 3;

export default function Home() {
  const promos = useMemo(() => montarCardapio().promocoes.slice(0, MAX_PROMOS_HOME), []);
  const cat = CATEGORIAS.promocoes;

  return (
    <>
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-carvao-900 text-creme-50">
        <div className="mx-auto max-w-2xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold tracking-wide text-ouro-300 uppercase">Pizzaria artesanal</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">{loja.nome}</h1>
          <p className="mt-4 max-w-md text-lg text-areia-200">
            Massa fermentada lentamente, ingredientes selecionados e entrega rápida até a sua porta.
          </p>
          <div className="mt-6">
            <StatusLoja />
          </div>
          <Link
            to="/cardapio"
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded border-2 border-carvao-900 bg-ouro-300 px-8 font-display text-xl text-carvao-900 shadow-[3px_3px_0_var(--color-carvao-900)]"
          >
            Ver cardápio
          </Link>
        </div>
      </section>

      <section className="px-4 pt-6 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {ORDEM.map((id) => (
            <Link
              key={id}
              to={`/cardapio?cat=${id}`}
              className={`flex min-h-11 shrink-0 items-center rounded border-2 border-carvao-900 px-4 font-semibold whitespace-nowrap ${CATEGORIAS[id].banda}`}
            >
              {CATEGORIAS[id].titulo}
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Promoções de hoje</h2>
          <Link to="/cardapio" className="text-sm font-semibold text-umbre-700 underline underline-offset-4">
            ver todas
          </Link>
        </div>
        {promos.length === 0 ? (
          <p className="mt-4 text-sm text-umbre-700">Sem promoções ativas hoje — confira o cardápio completo.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {promos.map((item) => (
              <Link
                key={item.id}
                to={`/pizza/${item.id}`}
                className="flex items-center gap-3 rounded border-2 border-carvao-900 bg-creme-50 p-3 shadow-[2px_2px_0_var(--color-carvao-900)]"
              >
                <Foto id={item.id} nome={item.nome} categoria={item.categoria} className="size-16 shrink-0 rounded" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold leading-snug">{item.nome}</p>
                  {item.descricao && <p className="truncate text-sm text-umbre-700">{item.descricao}</p>}
                  <p className={`mt-1 font-display text-lg ${cat.tinta}`}>{formatBRL(item.precos[0].preco)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="px-4 py-10">
        <h2 className="font-display text-2xl">Combos</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="flex flex-col justify-between rounded border-2 border-carvao-900 bg-creme-50 p-4 shadow-[2px_2px_0_var(--color-carvao-900)]"
            >
              <div>
                <p className="font-display text-lg">{combo.nome}</p>
                <p className="mt-1 text-sm text-umbre-700">{combo.descricao}</p>
                <p className="mt-2 font-display text-xl text-ouro-700">{formatBRL(combo.preco)}</p>
              </div>
              <Link
                to={`/cardapio?cat=${combo.categoria}`}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded border-2 border-carvao-900 bg-ouro-300 px-4 text-sm font-bold text-carvao-900"
              >
                Peça agora
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t-2 border-dashed border-taupe-400 px-4 py-10">
        <h2 className="font-display text-2xl">Informações</h2>
        <dl className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-bold text-umbre-700">Horário de funcionamento</dt>
            <dd className="mt-1 text-sm">
              {DIAS.map((dia, i) => {
                const h = loja.horarios[i];
                return (
                  <div key={dia} className="flex justify-between gap-2 border-b border-dashed border-taupe-400 py-0.5">
                    <span>{dia}</span>
                    <span>{h ? `${h.abre} – ${h.fecha}` : "Fechado"}</span>
                  </div>
                );
              })}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-umbre-700">Entrega</dt>
            <dd className="mt-1 text-sm">
              Taxa {formatBRL(loja.taxaEntrega)} · Pedido mínimo {formatBRL(loja.pedidoMinimo)}
              <br />
              Retirada sem taxa
              {loja.aceitaMesa && (
                <>
                  <br />
                  Atendemos também para consumo no local
                </>
              )}
            </dd>
          </div>
        </dl>
        {loja.telefone && (
          <a
            href={`https://wa.me/${loja.telefone}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded border-2 border-carvao-900 bg-oliva-500 px-6 font-bold text-creme-50 shadow-[2px_2px_0_var(--color-carvao-900)]"
          >
            Falar no WhatsApp
          </a>
        )}
      </section>

      <BarraPedirAgora />
    </>
  );
}

/** Rodapé fixo com CTA para quem ainda não adicionou nada; some assim que o carrinho tem itens (CartBar assume). */
function BarraPedirAgora() {
  const { count } = useCart();
  if (count > 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ouro-300 bg-carvao-900 pb-[env(safe-area-inset-bottom)] text-creme-50">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <p className="font-display text-lg">Pronto pra pedir?</p>
        <Link
          to="/cardapio"
          className="flex min-h-12 items-center rounded bg-ouro-300 px-5 font-bold text-carvao-900 active:bg-ouro-100"
        >
          Ver cardápio →
        </Link>
      </div>
    </div>
  );
}
