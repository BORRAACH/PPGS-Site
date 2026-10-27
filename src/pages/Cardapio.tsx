import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import CategoryNav from "../components/CategoryNav";
import ExtrasSheet from "../components/ExtrasSheet";
import ItemRow from "../components/ItemRow";
import { acai, adicionaisLanches } from "../data/cardapio";
import { CATEGORIAS, ORDEM, type CategoriaId } from "../lib/categorias";
import { montarCardapio, type ItemMenu } from "../lib/itens";
import { parsePreco } from "../lib/money";

export default function Cardapio() {
  const cardapio = useMemo(() => montarCardapio(), []);
  const ids = ORDEM.filter((id) => cardapio[id].length > 0);
  const [ativa, setAtiva] = useState<CategoriaId>(ids[0]);
  const [escolhido, setEscolhido] = useState<ItemMenu | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const secoes = useRef<Partial<Record<CategoriaId, HTMLElement>>>({});
  const travado = useRef(false);

  // scroll-spy: a seção que cruza a faixa logo abaixo da barra de categorias é a ativa
  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        if (travado.current) return;
        const visivel = entradas.find((e) => e.isIntersecting);
        if (visivel) setAtiva(visivel.target.getAttribute("data-cat") as CategoriaId);
      },
      { rootMargin: "-64px 0px -70% 0px" },
    );
    Object.values(secoes.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // pula direto para a categoria pedida via /cardapio?cat=<id> (combos e atalhos da Home)
  useEffect(() => {
    const alvo = searchParams.get("cat") as CategoriaId | null;
    if (alvo && ids.includes(alvo)) irPara(alvo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function irPara(id: CategoriaId) {
    setAtiva(id);
    // evita o spy "pular" categorias durante a rolagem suave
    travado.current = true;
    secoes.current[id]?.scrollIntoView({ block: "start" });
    setTimeout(() => (travado.current = false), 700);
  }

  // pizzas e promoções têm página própria; lanches e açaí seguem em modal
  function personalizar(item: ItemMenu) {
    if (item.tipo === "pizza" || item.tipo === "promo") navigate(`/pizza/${item.id}`);
    else setEscolhido(item);
  }

  return (
    <>
      <CategoryNav ids={ids} ativa={ativa} onSelect={irPara} />

      {ids.map((id) => {
        const cat = CATEGORIAS[id];
        return (
          <section
            key={id}
            data-cat={id}
            ref={(el) => {
              if (el) secoes.current[id] = el;
            }}
            aria-labelledby={`cat-${id}`}
            className="scroll-mt-14"
          >
            <h2 id={`cat-${id}`} className={`px-4 py-3 font-display text-3xl ${cat.banda}`}>
              {cat.titulo}
            </h2>
            <ul>
              {cardapio[id].map((item) => (
                <ItemRow key={item.id} item={item} onPersonalizar={personalizar} />
              ))}
            </ul>
          </section>
        );
      })}

      {escolhido?.tipo === "lanche" && (
        <ExtrasSheet
          id={escolhido.id}
          nome={escolhido.nome}
          descricao={escolhido.descricao}
          bases={escolhido.precos}
          rotuloBase="Tipo de pão"
          extras={adicionaisLanches}
          onClose={() => setEscolhido(null)}
        />
      )}
      {escolhido?.tipo === "acai" && (
        <ExtrasSheet
          id={escolhido.id}
          nome={escolhido.nome}
          descricao={escolhido.descricao}
          bases={acai.tamanhos.map((t) => ({ label: t.nome, preco: parsePreco(t.valor) }))}
          rotuloBase="Tamanho"
          extras={acai.adicionais}
          onClose={() => setEscolhido(null)}
        />
      )}
    </>
  );
}

