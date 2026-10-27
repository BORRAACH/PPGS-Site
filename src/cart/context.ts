import { createContext } from "react";
import type { CartItem } from "./types";

export interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  add: (item: Omit<CartItem, "qtd">) => void;
  setQtd: (key: string, qtd: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
