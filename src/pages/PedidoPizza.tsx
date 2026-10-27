import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { useCart } from "../cart/useCart";
import { adicionaisPizza, pizzas, type Pizza } from "../data/cardapio";
import { montarCardapio } from "../lib/itens";
import { formatBRL, parsePreco } from "../lib/money";

type Tam = "Mini" | "Broto" | "Grande";
/** Onde o adicional entra: pizza inteira, ou só a metade de um dos sabores */
type Onde = "inteira" | "a" | "b";

type Passo = "tamanho" | "extras";

const TAMANHOS: Tam[] = ["Mini", "Broto", "Grande"];

function precoTam(p: Pizza, t: Tam): number | null {
  const v = { Mini: p.valorMini, Broto: p.valorBroto, Grande: p.valorGrande }[
    t
  ];
  return v ? parsePreco(v) : null;
}

const chip = (ativo: boolean) =>
  `min-h-11 rounded border-2 border-carvao-900 px-3 text-left text-sm font-semibold ${
    ativo ? "bg-carvao-900 text-creme-50" : "bg-creme-50 text-carvao-900"
  }`;

interface Props {
  pizza: Pizza;
  /** Promoções do dia não permitem meio a meio */
  permiteMeio: boolean;
}

/**
 * Regras (iguais às do sistema desktop):
 * - meio a meio cobra o MAIOR preço entre os dois sabores, no tamanho escolhido;
 * - borda vale para a pizza inteira;
 * - adicional tem preço de inteira (`valor`) e de metade (`valorMetade`),
 *   este usado quando vai só em um dos sabores.
 */
function Fluxo({ pizza, permiteMeio }: Props) {
  const { add } = useCart();
  const navigate = useNavigate();
  const { key } = useLocation();
  // volta para onde o cliente estava no cardápio (mantém a rolagem); se a página foi aberta direto, vai ao início
  const onClose = () => (key === "default" ? navigate("/cardapio") : navigate(-1));
  const [meio, setMeio] = useState<Pizza | null>(null);
  const [tam, setTam] = useState<Tam>("Grande");
  const [borda, setBorda] = useState<string | null>(null);
  const [extras, setExtras] = useState<Record<string, Onde>>({});
  const [passo, setPasso] = useState<Passo>("tamanho");
  const [querExtras, setQuerExtras] = useState(false);

  const tamanhosOk = TAMANHOS.filter(
    (t) => precoTam(pizza, t) !== null && (!meio || precoTam(meio, t) !== null),
  );
  const tamAtual = tamanhosOk.includes(tam) ? tam : "Grande";

  const base = Math.max(
    precoTam(pizza, tamAtual)!,
    meio ? precoTam(meio, tamAtual)! : 0,
  );
  const bordaSel = adicionaisPizza.bordas.find((b) => b.nome === borda);
  const precoBorda = bordaSel ? parsePreco(bordaSel.valor) : 0;

  const linhasExtras = adicionaisPizza.adicionais
    .filter((a) => extras[a.nome])
    .map((a) => {
      const onde = extras[a.nome];
      const preco = parsePreco(
        onde === "inteira" ? a.valor : (a.valorMetade ?? a.valor),
      );
      const rotulo =
        onde === "inteira"
          ? a.nome
          : `${a.nome} (½ ${onde === "a" ? pizza.nome : meio!.nome})`;
      return { preco, rotulo };
    });
  const precoExtras = linhasExtras.reduce((s, l) => s + l.preco, 0);
  const total = base + precoBorda + precoExtras;

  function alternarMeio(ativo: boolean) {
    if (ativo) {
      setMeio(pizzas.find((p) => p.id !== pizza.id)!);
    } else {
      setMeio(null);
      // sem meio a meio, todo adicional vale para a pizza inteira
      setExtras((e) =>
        Object.fromEntries(Object.keys(e).map((k) => [k, "inteira" as Onde])),
      );
    }
  }

  function definirExtra(nome: string, onde: Onde | null) {
    setExtras((e) => {
      const resto = { ...e };
      delete resto[nome];
      return onde ? { ...resto, [nome]: onde } : resto;
    });
  }

  function confirmar() {
    const detalhes: string[] = [];
    if (meio) detalhes.push(`Meio a meio: ${pizza.nome} + ${meio.nome}`);
    if (bordaSel) detalhes.push(bordaSel.nome);
    linhasExtras.forEach((l) => detalhes.push(`+ ${l.rotulo}`));
    add({
      key: [
        "pizza",
        pizza.id,
        meio?.id,
        tamAtual,
        borda,
        JSON.stringify(extras),
      ].join("|"),
      nome: meio ? `${pizza.nome} / ${meio.nome}` : pizza.nome,
      opcao: tamAtual,
      detalhes,
      preco: total,
    });
    onClose();
  }

  // cada etapa começa no topo da página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [passo]);

  const passos: Passo[] = ["tamanho", "extras"];
  const idx = passos.indexOf(passo);
  const ultimo = idx === passos.length - 1;
  const titulos: Record<Passo, string> = {
    tamanho: permiteMeio ? "Tamanho e sabor" : "Tamanho",
    extras: "Borda e adicionais",
  };

  function escolherExtras(quer: boolean) {
    setQuerExtras(quer);
    if (!quer) {
      setBorda(null);
      setExtras({});
    }
  }

  return (
    <>
      <div className="flex items-start gap-3 border-b-2 border-dashed border-taupe-400 px-4 py-3">
        {idx > 0 && (
          <button
            type="button"
            onClick={() => setPasso(passos[idx - 1])}
            aria-label="Voltar"
            className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded text-2xl"
          >
            ‹
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-umbre-700 uppercase">
            Passo {idx + 1} de {passos.length}
          </p>
          <h1 className="font-display text-3xl leading-tight">
            {pizza.nome} · {titulos[passo]}
          </h1>
        </div>
      </div>

      <div className="px-4 py-4">
      <p className="text-sm text-umbre-700">{pizza.ingredientes}</p>

      {passo === "tamanho" && (
        <>
          <fieldset className="mt-4">
            <legend className="mb-2 text-lg font-bold">
              Qual o tamanho da pizza?
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {tamanhosOk.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={t === tamAtual}
                  onClick={() => setTam(t)}
                  className={chip(t === tamAtual)}
                >
                  {t}
                  <br />
                  <span className="font-display text-base font-normal">
                    {formatBRL(
                      Math.max(
                        precoTam(pizza, t)!,
                        meio ? precoTam(meio, t)! : 0,
                      ),
                    )}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          {permiteMeio && (
            <fieldset className="mt-4">
              <legend className="mb-2 text-lg font-bold">
                A pizza será meio a meio?
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={!meio}
                  onClick={() => alternarMeio(false)}
                  className={chip(!meio)}
                >
                  Inteira
                </button>
                <button
                  type="button"
                  aria-pressed={!!meio}
                  onClick={() => alternarMeio(true)}
                  className={chip(!!meio)}
                >
                  Meio a meio
                </button>
              </div>
              {meio && (
                <label className="mt-3 block text-sm font-semibold">
                  Outra metade
                  <select
                    value={meio.id}
                    onChange={(e) =>
                      setMeio(pizzas.find((p) => p.id === Number(e.target.value))!)
                    }
                    className="mt-1 min-h-11 w-full rounded border-2 border-carvao-900 bg-creme-50 px-2 text-base font-normal"
                  >
                    {pizzas
                      .filter((p) => p.id !== pizza.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))}
                  </select>
                  <span className="mt-1 block text-xs font-normal text-umbre-700">
                    No meio a meio vale o preço do sabor mais caro.
                  </span>
                </label>
              )}
            </fieldset>
          )}
        </>
      )}

      {passo === "extras" && (
        <>
          <fieldset className="mt-4">
            <legend className="mb-2 text-lg font-bold">
              Quer borda recheada ou adicionais?
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-pressed={!querExtras}
                onClick={() => escolherExtras(false)}
                className={chip(!querExtras)}
              >
                Não, obrigado
              </button>
              <button
                type="button"
                aria-pressed={querExtras}
                onClick={() => escolherExtras(true)}
                className={chip(querExtras)}
              >
                Sim, quero
              </button>
            </div>
          </fieldset>
          {querExtras && (
            <>
              <fieldset className="mt-4">
                <legend className="mb-2 font-bold">Borda recheada</legend>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    aria-pressed={borda === null}
                    onClick={() => setBorda(null)}
                    className={chip(borda === null)}
                  >
                    Sem borda
                  </button>
                  {adicionaisPizza.bordas.map((b) => (
                    <button
                      key={b.nome}
                      type="button"
                      aria-pressed={borda === b.nome}
                      onClick={() => setBorda(b.nome)}
                      className={chip(borda === b.nome)}
                    >
                      {b.nome.replace("Borda ", "")}
                      <span className="block text-xs font-normal">
                        + {formatBRL(parsePreco(b.valor))}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-4">
                <legend className="mb-2 font-bold">Adicionais</legend>
                <ul className="flex flex-col divide-y divide-taupe-400">
                  {adicionaisPizza.adicionais.map((a) => {
                    const onde = extras[a.nome];
                    const metade = a.valorMetade ?? a.valor;
                    return (
                      <li key={a.nome} className="py-2">
                        {meio ? (
                          <>
                            <p className="mb-1 font-semibold">{a.nome}</p>
                            <div className="flex flex-wrap gap-2">
                              {(
                                [
                                  [null, "Não", null],
                                  ["inteira", "Inteira", a.valor],
                                  ["a", `½ ${pizza.nome}`, metade],
                                  ["b", `½ ${meio.nome}`, metade],
                                ] as const
                              ).map(([v, rotulo, preco]) => (
                                <button
                                  key={rotulo}
                                  type="button"
                                  aria-pressed={(onde ?? null) === v}
                                  onClick={() => definirExtra(a.nome, v)}
                                  className={`${chip((onde ?? null) === v)} text-xs`}
                                >
                                  {rotulo}
                                  {preco &&
                                    ` · ${formatBRL(parsePreco(preco))}`}
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <label className="flex min-h-11 items-center gap-3">
                            <input
                              type="checkbox"
                              checked={!!onde}
                              onChange={(e) =>
                                definirExtra(
                                  a.nome,
                                  e.target.checked ? "inteira" : null,
                                )
                              }
                              className="size-6 accent-brasa-500"
                            />
                            <span className="flex-1 font-semibold">
                              {a.nome}
                            </span>
                            <span className="text-sm">
                              + {formatBRL(parsePreco(a.valor))}
                            </span>
                          </label>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </>
          )}
        </>
      )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-carvao-900 bg-areia-200 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-2xl p-3">
          <button
            type="button"
            onClick={ultimo ? confirmar : () => setPasso(passos[idx + 1])}
            className="flex min-h-12 w-full items-center justify-between rounded border-2 border-carvao-900 bg-ouro-300 px-4 font-bold text-carvao-900 active:bg-ouro-100"
          >
            <span>{ultimo ? "Adicionar ao pedido" : "Continuar"}</span>
            <span className="font-display text-xl">{formatBRL(total)}</span>
          </button>
        </div>
      </div>
    </>
  );
}

/** Página dedicada: /pizza/:itemId (itemId = id do item do cardápio, ex.: "pizza-3" ou "promo-1"). */
export default function PedidoPizza() {
  const { itemId } = useParams();
  const item = useMemo(() => {
    const c = montarCardapio();
    return [...c.pizzas, ...c.promocoes].find((i) => i.id === itemId);
  }, [itemId]);

  if (!item || (item.tipo !== "pizza" && item.tipo !== "promo")) return <Navigate to="/cardapio" replace />;
  return <Fluxo key={item.id} pizza={item.pizza} permiteMeio={item.tipo === "pizza"} />;
}
