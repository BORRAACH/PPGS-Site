export interface CartItem {
  /** Identifica item + escolhas: escolhas iguais somam quantidade */
  key: string;
  nome: string;
  /** Tamanho, tipo de pão etc. */
  opcao?: string;
  /** Meio a meio, borda, adicionais... */
  detalhes?: string[];
  preco: number;
  qtd: number;
}
