# Graph Report - ppgs-site  (2026-09-29)

## Corpus Check
- Corpus is ~12,921 words - fits in a single context window. You may not need a graph.

## Summary
- 256 nodes · 465 edges · 17 communities (10 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 19,959 input · 907 output

## Community Hubs (Navigation)
- Menu Data Layer
- Build & Dependencies
- Store Info & Delivery
- Menu UI Components
- Cart Bar & Header
- App TS Config
- Dev Tooling Dependencies
- Node TS Config
- Cart State Management
- App Routing & Layout
- Project Overview
- TS Project References
- Hero Placeholder Image

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `react` - 15 edges
3. `useCart()` - 15 edges
4. `formatBRL()` - 15 edges
5. `compilerOptions` - 15 edges
6. `react-router` - 11 edges
7. `montarCardapio()` - 11 edges
8. `parsePreco()` - 11 edges
9. `Fluxo()` - 10 edges
10. `Carrinho()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ItemRow()` --calls--> `useCart()`  [EXTRACTED]
  src/components/ItemRow.tsx → src/cart/useCart.ts
- `Carrinho()` --calls--> `useCart()`  [EXTRACTED]
  src/pages/Carrinho.tsx → src/cart/useCart.ts
- `BarraPedirAgora()` --calls--> `useCart()`  [EXTRACTED]
  src/pages/Home.tsx → src/cart/useCart.ts
- `Fluxo()` --calls--> `useCart()`  [EXTRACTED]
  src/pages/PedidoPizza.tsx → src/cart/useCart.ts
- `Props` --references--> `CategoriaId`  [EXTRACTED]
  src/components/CategoryNav.tsx → src/lib/categorias.ts

## Import Cycles
- None detected.

## Communities (17 total, 7 thin omitted)

### Community 0 - "Menu Data Layer"
Cohesion: 0.06
Nodes (44): src_data_cardapio_acai, src_data_cardapio_adicionais, src_data_cardapio_adicionaislanches, src_data_cardapio_bebidas, acai, adicionaisLanches, adicionaisPizza, bebidas (+36 more)

### Community 1 - "Build & Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, react, react-dom, react-router, tailwindcss, @tailwindcss/vite, name, private (+25 more)

### Community 2 - "Store Info & Delivery"
Cohesion: 0.13
Nodes (20): StatusLoja(), Props, Stepper(), esgotados, Janela, loja, TODO: o sistema desktop valida por tempo de rota (limiteEntregaMin);, norm() (+12 more)

### Community 3 - "Menu UI Components"
Cohesion: 0.18
Nodes (17): react, CategoryNav(), Props, Foto(), fotos, porId, Props, ItemRow() (+9 more)

### Community 4 - "Cart Bar & Header"
Cohesion: 0.16
Nodes (15): react-router, useCart(), CartBar(), ExtrasSheet(), Props, Header(), Opcao, ProductCard() (+7 more)

### Community 5 - "App TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 6 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @babel/core, babel-plugin-react-compiler, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+9 more)

### Community 7 - "Node TS Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 8 - "Cart State Management"
Cohesion: 0.26
Nodes (9): Action, CartProvider(), load(), reducer(), CartContext, CartContextValue, CartItem, Pedido (+1 more)

### Community 9 - "App Routing & Layout"
Cohesion: 0.27
Nodes (6): react-dom, App(), src_index, RootLayout(), NotFound(), router

## Knowledge Gaps
- **93 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 123 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Menu UI Components` to `Menu Data Layer`, `Build & Dependencies`, `Store Info & Delivery`, `Cart Bar & Header`, `Cart State Management`, `App Routing & Layout`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Why does `react-router` connect `Cart Bar & Header` to `Menu Data Layer`, `Build & Dependencies`, `Store Info & Delivery`, `Menu UI Components`, `App Routing & Layout`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `Build & Dependencies`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Menu Data Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.06219426974143955 - nodes in this community are weakly interconnected._
- **Should `Build & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06825396825396825 - nodes in this community are weakly interconnected._
- **Should `Store Info & Delivery` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._