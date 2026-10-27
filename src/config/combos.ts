import type { CategoriaId } from "../lib/categorias";

export type Combo = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: CategoriaId;
};

/** TODO: valores provisórios — ajustar aos reais */
export const combos: Combo[] = [
  {
    id: "combo-casal",
    nome: "Combo Casal",
    descricao: "2 pizzas broto + refrigerante 1L",
    preco: 79.9,
    categoria: "pizzas",
  },
  {
    id: "combo-familia",
    nome: "Combo Família",
    descricao: "1 pizza grande + 1 pizza broto + refrigerante 2L",
    preco: 109.9,
    categoria: "pizzas",
  },
  {
    id: "combo-solo",
    nome: "Combo Solo",
    descricao: "1 pizza broto + refrigerante lata",
    preco: 44.9,
    categoria: "pizzas",
  },
];
