# 0010 — Breakpoints padrão do Tailwind v4

## Status

~~Aceito~~ — **Substituída por [0014](0014-tokens-real-values-breakpoints-and-radius.md)** em 2026-08-06, quando `design-tokens.json` (fonte de verdade oficial) trouxe breakpoints customizados reais.

## Contexto

Recodificação com fidelidade visual (não redesign). O design system já definido do projeto não especifica breakpoints customizados em px.

## Decisão

- Usar os breakpoints default do Tailwind v4: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`. Sem override em `tokens.css`/`@theme`.
- Abordagem mobile-first padrão do Tailwind: estilos base sem prefixo para mobile, prefixos (`md:`, `lg:`, etc.) para telas maiores.

## Consequências

- Nenhuma configuração adicional de breakpoint necessária.
- Se o QA visual contra o site atual (Hostinger Horizons) revelar desalinhamentos em larguras intermediárias específicas, esta ADR deve ser revisitada com valores customizados extraídos do site original.
