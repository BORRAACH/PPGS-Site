export type CategoriaId =
  | "promocoes"
  | "pizzas"
  | "lanches"
  | "acai"
  | "bebidas"
  | "outros";

/**
 * Cor por categoria segue o sistema desktop (pizzas = brasa, lanches =
 * terracota, bebidas = índigo, açaí = uva, diárias = ouro).
 * Classes escritas por extenso para o Tailwind enxergá-las.
 */
export const CATEGORIAS: Record<
  CategoriaId,
  { titulo: string; banda: string; tinta: string; monograma: string }
> = {
  promocoes: {
    titulo: "Promoção do dia",
    banda: "bg-ouro-300 text-carvao-900",
    tinta: "text-ouro-700",
    monograma: "bg-ouro-100 text-ouro-700",
  },
  pizzas: {
    titulo: "Pizzas",
    banda: "bg-brasa-500 text-white",
    tinta: "text-brasa-500",
    monograma: "bg-brasa-50 text-brasa-500",
  },
  lanches: {
    titulo: "Lanches",
    banda: "bg-terracota-500 text-white",
    tinta: "text-terracota-500",
    monograma: "bg-terracota-50 text-terracota-500",
  },
  acai: {
    titulo: "Açaí",
    banda: "bg-uva-500 text-white",
    tinta: "text-uva-500",
    monograma: "bg-uva-50 text-uva-500",
  },
  bebidas: {
    titulo: "Bebidas",
    banda: "bg-indigo-500 text-white",
    tinta: "text-indigo-500",
    monograma: "bg-indigo-50 text-indigo-500",
  },
  outros: {
    titulo: "Outros",
    banda: "bg-ouro-700 text-white",
    tinta: "text-ouro-700",
    monograma: "bg-ouro-100 text-ouro-700",
  },
};

export const ORDEM: CategoriaId[] = [
  "promocoes",
  "pizzas",
  "lanches",
  "acai",
  "bebidas",
  "outros",
];
