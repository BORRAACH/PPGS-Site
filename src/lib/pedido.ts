import type { CartItem } from "../cart/types";

export interface Pedido {
  cliente: { nome: string; telefone: string };
  tipo: "entrega" | "retirada" | "mesa";
  mesa?: string;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
  };
  pagamento: "pix" | "dinheiro" | "cartao";
  troco?: string;
  observacoes?: string;
  itens: CartItem[];
  subtotal: number;
  taxaEntrega: number;
  total: number;
}

/**
 * TODO: integrar com o backend (ppgs_server).
 * Por enquanto apenas simula o envio.
 */
export async function enviarPedido(pedido: Pedido): Promise<{ id: string }> {
  console.log("Pedido enviado:", pedido);
  await new Promise((r) => setTimeout(r, 500));
  return { id: crypto.randomUUID().slice(0, 8) };
}
