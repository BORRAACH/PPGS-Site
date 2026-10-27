import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import Stepper from "../components/Stepper";
import { useCart } from "../cart/useCart";
import { loja } from "../config/loja";
import { verificarCep, type ResultadoCep } from "../lib/entrega";
import { formatBRL } from "../lib/money";
import { enviarPedido, type Pedido } from "../lib/pedido";
import { useStatusLoja } from "../lib/statusLoja";

type Tipo = Pedido["tipo"];
type EstadoCep = ResultadoCep | { status: "vazio" | "verificando" };

const campo =
  "min-h-12 w-full rounded border-2 border-carvao-900 bg-creme-50 px-3 text-base placeholder:text-umbre-600";
const rotulo = "block text-sm font-bold";

const mascaraCep = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

export default function Carrinho() {
  const { items, total: subtotal, setQtd, clear } = useCart();
  const { aberto, texto: textoStatus } = useStatusLoja();
  const [tipo, setTipo] = useState<Tipo>("entrega");
  const [cep, setCep] = useState("");
  const [consulta, setConsulta] = useState<{ cep: string; res: ResultadoCep } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [pagamento, setPagamento] = useState<Pedido["pagamento"]>("pix");

  const digitos = cep.replace(/\D/g, "");

  // validação imediata: assim que o CEP tem 8 dígitos, confere a área de entrega
  useEffect(() => {
    if (digitos.length < 8) return;
    const ctl = new AbortController();
    verificarCep(digitos, ctl.signal)
      .then((res) => setConsulta({ cep: digitos, res }))
      .catch(() => {});
    return () => ctl.abort();
  }, [digitos]);

  const estadoCep: EstadoCep =
    digitos.length < 8
      ? { status: "vazio" }
      : consulta?.cep === digitos
        ? consulta.res
        : { status: "verificando" };

  if (pedidoId) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="font-display text-4xl">Pedido enviado!</h1>
        <p className="mt-2">
          Número do pedido: <b>{pedidoId}</b>
        </p>
        <Link to="/cardapio" className="mt-6 inline-flex min-h-12 items-center rounded border-2 border-carvao-900 bg-ouro-300 px-5 font-bold">
          Voltar ao cardápio
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Seu pedido está vazio</h1>
        <Link to="/cardapio" className="mt-6 inline-flex min-h-12 items-center rounded border-2 border-carvao-900 bg-ouro-300 px-5 font-bold">
          Ver cardápio
        </Link>
      </div>
    );
  }

  const taxa = tipo === "entrega" ? loja.taxaEntrega : 0;
  const total = subtotal + taxa;

  // motivos que impedem enviar — mostrados antes do botão, nunca só no fim
  const bloqueios: string[] = [];
  if (!aberto) bloqueios.push(`Loja fechada (${textoStatus.replace("Fechado · ", "")}).`);
  if (tipo === "entrega") {
    if (subtotal < loja.pedidoMinimo) {
      bloqueios.push(`Faltam ${formatBRL(loja.pedidoMinimo - subtotal)} para o pedido mínimo de entrega.`);
    }
    if (estadoCep.status === "fora") bloqueios.push(estadoCep.motivo);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (bloqueios.length) return;
    const f = new FormData(e.currentTarget);
    const t = (k: string) => String(f.get(k) ?? "").trim();

    const endereco =
      tipo === "entrega" && estadoCep.status === "ok"
        ? {
            cep: digitos,
            logradouro: t("logradouro") || estadoCep.logradouro,
            numero: t("numero"),
            complemento: t("complemento") || undefined,
            bairro: t("bairro") || estadoCep.bairro,
            cidade: estadoCep.cidade,
          }
        : undefined;

    setEnviando(true);
    try {
      const { id } = await enviarPedido({
        cliente: { nome: t("nome"), telefone: t("telefone") },
        tipo,
        mesa: tipo === "mesa" ? t("mesa") : undefined,
        endereco,
        pagamento,
        troco: pagamento === "dinheiro" ? t("troco") || undefined : undefined,
        observacoes: t("observacoes") || undefined,
        itens: items,
        subtotal,
        taxaEntrega: taxa,
        total,
      });
      clear();
      setPedidoId(id);
    } finally {
      setEnviando(false);
    }
  }

  const tipos: [Tipo, string][] = [
    ["entrega", "Entrega"],
    ["retirada", "Retirada"],
    ...(loja.aceitaMesa ? ([["mesa", "Mesa"]] as [Tipo, string][]) : []),
  ];

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <h1 className="bg-carvao-800 px-4 py-3 font-display text-3xl text-creme-50">Seu pedido</h1>

      <ul className="border-b-2 border-carvao-900">
        {items.map((i) => (
          <li key={i.key} className="flex items-center justify-between gap-3 border-b-2 border-dashed border-taupe-400 px-4 py-3">
            <div className="min-w-0">
              <p className="font-bold leading-snug">{i.nome}</p>
              <p className="text-sm text-umbre-700">
                {[i.opcao, ...(i.detalhes ?? [])].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 font-display text-lg">{formatBRL(i.preco * i.qtd)}</p>
            </div>
            <Stepper qtd={i.qtd} nome={i.nome} onChange={(q) => setQtd(i.key, q)} />
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 px-4 py-4">
        <fieldset>
          <legend className={`${rotulo} mb-2`}>Como quer receber?</legend>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tipos.length}, 1fr)` }}>
            {tipos.map(([v, nome]) => (
              <button
                key={v}
                type="button"
                aria-pressed={tipo === v}
                onClick={() => setTipo(v)}
                className={`min-h-12 rounded border-2 border-carvao-900 font-bold ${
                  tipo === v ? "bg-carvao-900 text-creme-50" : "bg-creme-50"
                }`}
              >
                {nome}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-umbre-700">
            {tipo === "entrega" && `Taxa de entrega ${formatBRL(loja.taxaEntrega)} · pedido mínimo ${formatBRL(loja.pedidoMinimo)}`}
            {tipo === "retirada" && "Sem taxa. Retire no balcão."}
            {tipo === "mesa" && "Sem taxa. Levamos à sua mesa."}
          </p>
        </fieldset>

        <label>
          <span className={rotulo}>Nome</span>
          <input name="nome" required autoComplete="name" className={campo} />
        </label>
        <label>
          <span className={rotulo}>Telefone / WhatsApp</span>
          <input name="telefone" required type="tel" inputMode="tel" autoComplete="tel" className={campo} />
        </label>

        {tipo === "mesa" && (
          <label>
            <span className={rotulo}>Número da mesa</span>
            <input name="mesa" required inputMode="numeric" className={campo} />
          </label>
        )}

        {tipo === "entrega" && (
          <fieldset className="flex flex-col gap-3 rounded border-2 border-dashed border-carvao-900 p-3">
            <legend className={`${rotulo} px-1`}>Endereço de entrega</legend>
            <label>
              <span className={rotulo}>CEP</span>
              <input
                value={cep}
                onChange={(e) => setCep(mascaraCep(e.target.value))}
                required
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                aria-describedby="cep-status"
                aria-invalid={estadoCep.status === "fora" || estadoCep.status === "naoEncontrado"}
                className={campo}
              />
            </label>
            <p id="cep-status" role="status" className="text-sm font-semibold">
              {estadoCep.status === "verificando" && "Verificando CEP…"}
              {estadoCep.status === "ok" && (
                <span className="text-oliva-500">
                  ✓ Entregamos aí — {[estadoCep.bairro, estadoCep.cidade].filter(Boolean).join(", ")}
                </span>
              )}
              {estadoCep.status === "fora" && <span className="text-brasa-500">✕ {estadoCep.motivo}</span>}
              {estadoCep.status === "naoEncontrado" && <span className="text-brasa-500">✕ CEP não encontrado.</span>}
              {estadoCep.status === "erro" && (
                <span className="text-brasa-500">Não foi possível verificar o CEP agora. Tente de novo.</span>
              )}
            </p>
            {estadoCep.status === "ok" && (
              <>
                <label>
                  <span className={rotulo}>Rua</span>
                  <input key={estadoCep.logradouro} name="logradouro" required defaultValue={estadoCep.logradouro} className={campo} />
                </label>
                <label>
                  <span className={rotulo}>Bairro</span>
                  <input key={estadoCep.bairro} name="bairro" required defaultValue={estadoCep.bairro} className={campo} />
                </label>
                <div className="grid grid-cols-[6rem_1fr] gap-3">
                  <label>
                    <span className={rotulo}>Número</span>
                    <input name="numero" required inputMode="numeric" className={campo} />
                  </label>
                  <label>
                    <span className={rotulo}>Complemento</span>
                    <input name="complemento" placeholder="Apto, bloco… (opcional)" className={campo} />
                  </label>
                </div>
              </>
            )}
          </fieldset>
        )}

        <fieldset>
          <legend className={`${rotulo} mb-2`}>Pagamento</legend>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["pix", "Pix"],
                ["dinheiro", "Dinheiro"],
                ["cartao", "Cartão"],
              ] as const
            ).map(([v, nome]) => (
              <button
                key={v}
                type="button"
                aria-pressed={pagamento === v}
                onClick={() => setPagamento(v)}
                className={`min-h-12 rounded border-2 border-carvao-900 font-bold ${
                  pagamento === v ? "bg-carvao-900 text-creme-50" : "bg-creme-50"
                }`}
              >
                {nome}
              </button>
            ))}
          </div>
          {pagamento === "dinheiro" && (
            <label className="mt-3 block">
              <span className={rotulo}>Troco para quanto?</span>
              <input name="troco" inputMode="decimal" placeholder="Opcional" className={campo} />
            </label>
          )}
        </fieldset>

        <label>
          <span className={rotulo}>Observações</span>
          <textarea name="observacoes" rows={2} className={`${campo} py-2`} />
        </label>

        <dl className="border-y-2 border-carvao-900 py-3">
          <div className="flex justify-between py-0.5">
            <dt>Itens</dt>
            <dd>{formatBRL(subtotal)}</dd>
          </div>
          {tipo === "entrega" && (
            <div className="flex justify-between py-0.5">
              <dt>Taxa de entrega</dt>
              <dd>{formatBRL(taxa)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between pt-1">
            <dt className="font-bold">Total</dt>
            <dd className="font-display text-3xl">{formatBRL(total)}</dd>
          </div>
        </dl>

        {bloqueios.length > 0 && (
          <ul role="alert" className="flex flex-col gap-1 rounded border-2 border-brasa-500 bg-brasa-50 p-3 text-sm font-semibold text-brasa-500">
            {bloqueios.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={enviando || bloqueios.length > 0}
          className="min-h-14 rounded border-2 border-carvao-900 bg-ouro-300 text-lg font-bold shadow-[3px_3px_0_var(--color-carvao-900)] disabled:cursor-not-allowed disabled:bg-areia-300 disabled:text-umbre-600 disabled:shadow-none"
        >
          {enviando ? "Enviando…" : "Enviar pedido"}
        </button>
      </div>
    </form>
  );
}
