import { useEffect, useReducer, type ReactNode } from "react";
import { CartContext, type CartContextValue } from "./context";
import type { CartItem } from "./types";

type Action =
  | { type: "add"; item: Omit<CartItem, "qtd"> }
  | { type: "setQtd"; key: string; qtd: number }
  | { type: "clear" };


const STORAGE_KEY = "ppgs-carrinho";

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "add": {
      const existe = state.some((i) => i.key === action.item.key);
      if (existe) {
        return state.map((i) =>
          i.key === action.item.key ? { ...i, qtd: i.qtd + 1 } : i,
        );
      }
      return [...state, { ...action.item, qtd: 1 }];
    }
    case "setQtd":
      return state
        .map((i) => (i.key === action.key ? { ...i, qtd: action.qtd } : i))
        .filter((i) => i.qtd > 0);
    case "clear":
      return [];
  }
}

function load(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value: CartContextValue = {
    items,
    total: items.reduce((s, i) => s + i.preco * i.qtd, 0),
    count: items.reduce((s, i) => s + i.qtd, 0),
    add: (item) => dispatch({ type: "add", item }),
    setQtd: (key, qtd) => dispatch({ type: "setQtd", key, qtd }),
    clear: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
