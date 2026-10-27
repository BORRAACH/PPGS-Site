import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="px-4 py-16 text-center">
      <h1 className="font-display text-4xl">Página não encontrada</h1>
      <Link to="/cardapio" className="mt-4 inline-block min-h-11 py-2 font-semibold underline underline-offset-4">
        Voltar ao cardápio
      </Link>
    </div>
  );
}
