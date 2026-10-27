/**
 * Dados da loja. TODO: valores provisórios — ajustar aos reais
 * (ou buscar do backend/ppgs_server).
 */

/** Horários por dia da semana (0 = domingo). null = fechado. Se `fecha` < `abre`, vira a madrugada. */
type Janela = { abre: string; fecha: string } | null;

export const loja = {
  nome: "Pizzaria",
  telefone: "", // ex.: "5511999999999" (habilita botão de WhatsApp quando preenchido)

  horarios: {
    0: { abre: "19:00", fecha: "23:59" },
    1: { abre: "19:00", fecha: "23:59" },
    2: { abre: "19:00", fecha: "23:59" },
    3: { abre: "19:00", fecha: "23:59" },
    4: { abre: "19:00", fecha: "23:59" },
    5: { abre: "19:00", fecha: "23:59" },
    6: { abre: "19:00", fecha: "23:59" },
  } satisfies Record<number, Janela> as Record<number, Janela>,

  taxaEntrega: 6,
  /** Mínimo (só itens, sem taxa) para pedidos de entrega */
  pedidoMinimo: 30,

  /**
   * Área de entrega checada no CEP. Listas vazias = aceita qualquer CEP.
   * TODO: o sistema desktop valida por tempo de rota (limiteEntregaMin);
   * quando o backend expuser isso, trocar `verificarCep` em lib/entrega.ts.
   */
  areaEntrega: {
    cidades: [] as string[],
    bairros: [] as string[],
  },

  /** Habilita a opção "Mesa" no pedido */
  aceitaMesa: true,
};

/**
 * Itens esgotados hoje (ids de `lib/itens.ts`, ex.: "pizza-12", "bebida-skol-600ml").
 * Aparecem no cardápio marcados como indisponíveis.
 */
export const esgotados = new Set<string>([]);
