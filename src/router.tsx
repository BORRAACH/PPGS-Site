import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Cardapio from "./pages/Cardapio";
import Carrinho from "./pages/Carrinho";
import PedidoPizza from "./pages/PedidoPizza";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "cardapio", Component: Cardapio },
      { path: "pizza/:itemId", Component: PedidoPizza },
      { path: "carrinho", Component: Carrinho },
      { path: "*", Component: NotFound },
    ],
  },
]);
