export interface Item {
  nome: string;
  valor: string;
}

export interface Bebida extends Item {
  valorMesa?: string;
}

export interface Adicional extends Item {
  valorMetade?: string;
}

export interface Pizza {
  id: number;
  nome: string;
  ingredientes: string;
  valorMini?: string;
  valorBroto: string;
  valorGrande: string;
}

export interface Lanche {
  id: number;
  nome: string;
  ingredientes: string;
  valor: Record<string, string>;
}

export interface AdicionaisPizza {
  bordas: Item[];
  adicionais: Adicional[];
}

export interface Acai {
  tamanhos: Item[];
  adicionais: Item[];
}
