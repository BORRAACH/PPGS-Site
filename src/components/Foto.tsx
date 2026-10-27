import { useState } from "react";
import { CATEGORIAS, type CategoriaId } from "../lib/categorias";

// Fotos reais: coloque em src/assets/fotos/<id-do-item>.webp (ou .jpg/.png),
// ex.: pizza-1.webp, lanche-3.webp, bebida-skol-600ml.webp.
const fotos = import.meta.glob<string>("../assets/fotos/*.{webp,jpg,jpeg,png,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const porId = Object.fromEntries(
  Object.entries(fotos).map(([caminho, url]) => [
    caminho.split("/").pop()!.replace(/\.[^.]+$/, ""),
    url,
  ]),
);

interface Props {
  id: string;
  nome: string;
  categoria: CategoriaId;
  className?: string;
}

/** Foto do item; sem foto cadastrada, mostra a inicial em Caprasimo na cor da categoria. */
export default function Foto({ id, nome, categoria, className = "" }: Props) {
  const [falhou, setFalhou] = useState(false);
  const src = porId[id];

  if (!src || falhou) {
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center font-display text-4xl ${CATEGORIAS[categoria].monograma} ${className}`}
      >
        {nome.trim().charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={nome}
      loading="lazy"
      decoding="async"
      width={96}
      height={96}
      onError={() => setFalhou(true)}
      className={`object-cover ${className}`}
    />
  );
}
