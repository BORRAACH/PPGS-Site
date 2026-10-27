import { useStatusLoja } from "../lib/statusLoja";

export default function StatusLoja() {
  const { aberto, texto } = useStatusLoja();
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
        aberto ? "bg-oliva-50 text-oliva-500" : "bg-brasa-50 text-brasa-500"
      }`}
    >
      <span aria-hidden className={`size-2.5 rounded-full ${aberto ? "bg-oliva-500" : "bg-brasa-500"}`} />
      {texto}
    </p>
  );
}
