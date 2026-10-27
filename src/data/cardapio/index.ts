import acaiJson from "./acai.json";
import adicionaisJson from "./adicionais.json";
import adicionaisLanchesJson from "./adicionaisLanches.json";
import bebidasJson from "./bebidas.json";
import lanchesJson from "./lanches.json";
import outrosJson from "./outros.json";
import pizzasJson from "./pizzas.json";
import promoSegQuiJson from "./promocoes/promo_seg_qui.json";
import promoSexDomJson from "./promocoes/promo_sex_dom.json";
import type {
  Acai,
  AdicionaisPizza,
  Bebida,
  Item,
  Lanche,
  Pizza,
} from "./types";

export type * from "./types";

export const pizzas: Pizza[] = pizzasJson;
export const lanches: Lanche[] = lanchesJson;
export const bebidas: Bebida[] = bebidasJson;
export const outros: Item[] = outrosJson;
export const acai: Acai = acaiJson;
export const adicionaisPizza: AdicionaisPizza = adicionaisJson;
export const adicionaisLanches: Item[] = adicionaisLanchesJson;

export const promocoes = {
  segQui: promoSegQuiJson as Pizza[],
  sexDom: promoSexDomJson as Pizza[],
};
