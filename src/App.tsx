import { RouterProvider } from "react-router/dom";
import { CartProvider } from "./cart/CartContext";
import { router } from "./router";

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
