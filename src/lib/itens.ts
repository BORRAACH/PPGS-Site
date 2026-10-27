import {
  acai,
  bebidas,
  lanches,
  outros,
  pizzas,
  promocoes,
  type Lanche,
  type Pizza,
} from "../data/cardapio";
import type { CategoriaId } from "./categorias";
import { parsePreco } from "./money";

export interface Opcao {
  label: string;
  preco: number;
}

export type ItemMenu = {
  id: string;
  categoria: CategoriaId;
  nome: string;
  descricao?: string;
  /** Preços exibidos direto na linha */
  precos: Opcao[];
} & (
  | { tipo: "pizza" | "promo"; pizza: Pizza }
  | { tipo: "lanche"; lanche: Lanche }
  | { tipo: "acai" }
  | { tipo: "simples" }
);

export const PAES: Record<string, string> = {
  pao_hamburguer: "Pão hambúrguer",
  pao_frances: "Pão francês",
  pao_baby: "Pão baby",
};

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function precosPizza(p: Pizza): Opcao[] {
  const o: Opcao[] = [];
  if (p.valorMini) o.push({ label: "Mini", preco: parsePreco(p.valorMini) });
  o.push({ label: "Broto", preco: parsePreco(p.valorBroto) });
  o.push({ label: "Grande", preco: parsePreco(p.valorGrande) });
  return o;
}

function itemPizza(tipo: "pizza" | "promo", p: Pizza): ItemMenu {
  return {
    id: `${tipo}-${p.id}`,
    categoria: tipo === "promo" ? "promocoes" : "pizzas",
    nome: p.nome,
    descricao: p.ingredientes,
    precos: precosPizza(p),
    tipo,
    pizza: p,
  };
}

// Seg–Qui e Sex–Dom têm promoções diferentes
function promoDoDia(hoje = new Date().getDay()) {
  return hoje === 0 || hoje >= 5 ? promocoes.sexDom : promocoes.segQui;
}

export function montarCardapio(): Record<CategoriaId, ItemMenu[]> {
  return {
    promocoes: promoDoDia().map((p) => itemPizza("promo", p)),
    pizzas: pizzas.map((p) => itemPizza("pizza", p)),
    lanches: lanches.map((l) => ({
      id: `lanche-${l.id}`,
      categoria: "lanches",
      nome: l.nome,
      descricao: l.ingredientes,
      precos: Object.entries(l.valor)
        .map(([k, v]) => ({ label: PAES[k] ?? k, preco: parsePreco(v) }))
        .sort((a, b) => a.preco - b.preco),
      tipo: "lanche",
      lanche: l,
    })),
    acai: [
      {
        id: "acai",
        categoria: "acai",
        nome: "Açaí",
        descricao: "Escolha o tamanho e turbine com adicionais.",
        precos: acai.tamanhos.map((t) => ({
          label: t.nome,
          preco: parsePreco(t.valor),
        })),
        tipo: "acai",
      },
    ],
    bebidas: bebidas.map((b) => ({
      id: `bebida-${slug(b.nome)}`,
      categoria: "bebidas",
      nome: b.nome.replace(/\s+/g, " "),
      precos: [{ label: "", preco: parsePreco(b.valor) }],
      tipo: "simples",
    })),
    outros: outros.map((o) => ({
      id: `outro-${slug(o.nome)}`,
      categoria: "outros",
      nome: o.nome.charAt(0).toUpperCase() + o.nome.slice(1).toLowerCase(),
      precos: [{ label: "", preco: parsePreco(o.valor) }],
      tipo: "simples",
    })),
  };
}
