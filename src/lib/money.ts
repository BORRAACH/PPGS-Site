/** Converte "59,90" (formato do cardápio) em número. */
export function parsePreco(valor: string): number {
  return Number(valor.replace(/\./g, "").replace(",", "."));
}

export function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "59,90" sem o símbolo da moeda */
export function formatNum(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
