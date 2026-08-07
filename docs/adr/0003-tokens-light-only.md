# 0003 — Design tokens: tema único (light), sem dark mode

## Status

Aceito — 2026-08-06

## Contexto

O scaffold padrão do `create-next-app` inclui um bloco `@media (prefers-color-scheme: dark)` em `app/globals.css`, alternando `--background`/`--foreground`. O site institucional da Dna Air Cargo tem uma paleta de marca fixa definida no design system existente (recodificação com fidelidade visual, não redesign) — confirmado que não há intenção de suportar dark mode adaptável ao SO do visitante.

## Decisão

- Remover o bloco `@media (prefers-color-scheme: dark)` do `globals.css`.
- Tokens de cor definidos como um único conjunto de custom properties em `:root`, expostos ao Tailwind v4 via `@theme inline` (setup CSS-first já presente no projeto — sem `tailwind.config.ts`).
- Nenhum token de cor recebe par light/dark.

## Consequências

- Simplifica a tabela de tokens: um valor por token, sem necessidade de estratégia de override por tema.
- Se no futuro for pedido dark mode, esta ADR precisa ser revisitada e os tokens de cor reestruturados para pares de valores (ou uso de `light-dark()` CSS).
