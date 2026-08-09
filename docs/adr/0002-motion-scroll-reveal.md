# 0002 — Scroll-reveal via hook nativo (Intersection Observer), sem lib de animação

## Status

Aceito — 2026-08-06. **Revertida por 0019 (2026-08-08)**: o site passou a usar `framer-motion` em vez do hook nativo — decisão explícita do cliente. O restante do raciocínio (único ponto de fronteira `"use client"` pra motion, resto do site como Server Component) continua válido, só a implementação do `<Reveal>` mudou.

## Contexto

O design system já definido do site prevê regras de motion com scroll-reveal. Essa decisão determina onde ficam os limites `"use client"` no App Router, já que qualquer seção com scroll-reveal precisa rodar JS no cliente para observar a viewport.

Alternativas consideradas: `framer-motion`/`motion` (biblioteca dedicada) vs. hook próprio com `IntersectionObserver` nativo.

## Decisão

- Hook `useScrollReveal` usando `IntersectionObserver` nativo, sem dependência externa de animação.
- Componente wrapper `<Reveal>` em `components/site/reveal.tsx`, marcado `"use client"`, que recebe `children` e aplica a transição de entrada (opacity/translate via CSS, classe toggled pelo hook).
- Todo o resto do site (layout, conteúdo, metadata) permanece Server Component por padrão. `<Reveal>` é o único ponto de fronteira cliente para motion.

## Consequências

- Sem dependência extra (~40kb+) de `framer-motion`/`motion` no bundle.
- Mais HTML estático e cacheável — ajuda LCP/SEO nas páginas institucionais.
- Não há suporte nativo a física de mola, gestos complexos ou orquestração de stagger rica. Se o design system evoluir para exigir isso, revisitar esta ADR.
- Só o formulário de orçamento (Server Action) precisa de renderização dinâmica; o motion via `<Reveal>` não força isso porque não depende de nonce/CSP nem de dados por-request.
