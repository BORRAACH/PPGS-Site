import { loja } from "../config/loja";

export type ResultadoCep =
  | { status: "ok"; logradouro: string; bairro: string; cidade: string; uf: string }
  | { status: "fora"; motivo: string }
  | { status: "naoEncontrado" }
  | { status: "erro" };

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Consulta o CEP no ViaCEP e confere a área de entrega (config/loja.ts).
 * TODO: trocar pela validação do backend (zona por tempo de rota).
 */
export async function verificarCep(
  cepDigitos: string,
  signal?: AbortSignal,
): Promise<ResultadoCep> {
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cepDigitos}/json/`, { signal });
    if (!r.ok) return { status: "naoEncontrado" };
    const d = await r.json();
    if (d.erro) return { status: "naoEncontrado" };

    const { cidades, bairros } = loja.areaEntrega;
    if (cidades.length && !cidades.some((c) => norm(c) === norm(d.localidade))) {
      return { status: "fora", motivo: `Não entregamos em ${d.localidade}.` };
    }
    if (bairros.length && d.bairro && !bairros.some((b) => norm(b) === norm(d.bairro))) {
      return { status: "fora", motivo: `Ainda não entregamos no bairro ${d.bairro}.` };
    }
    return {
      status: "ok",
      logradouro: d.logradouro ?? "",
      bairro: d.bairro ?? "",
      cidade: d.localidade,
      uf: d.uf,
    };
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    return { status: "erro" };
  }
}
