import { Outlet, ScrollRestoration } from "react-router";
import CartBar from "../components/CartBar";
import Header from "../components/Header";

export default function RootLayout() {
  return (
    <div className="min-h-dvh pb-28">
      <Header />
      <main className="mx-auto max-w-2xl">
        <Outlet />
      </main>
      <CartBar />
      <ScrollRestoration />
    </div>
  );
}
