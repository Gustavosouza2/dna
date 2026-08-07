# 0004 — Arquivo de tokens separado e escala de radius do shadcn/ui

## Status

Aceito — 2026-08-06. **Mecanismo de radius emendado por [0014](0014-tokens-real-values-breakpoints-and-radius.md)** (valores explícitos em vez de escala `calc()` derivada) — decisão de localização do arquivo de tokens (`app/tokens.css`) permanece vigente.

## Contexto

O design system já definido tem radius máximo de 14px. O shadcn/ui gera componentes que consomem uma escala derivada de uma única variável `--radius` (`--radius-sm = calc(var(--radius) - 4px)`, `--radius-md = calc(var(--radius) - 2px)`, `--radius-lg = var(--radius)`, `--radius-xl = calc(var(--radius) + 4px)`, aproximadamente — confirmar valores exatos ao rodar `npx shadcn init`). Confirmado com o cliente/design: 14px é o teto da escala (`--radius-lg`, usado em cards e botões grandes), não um valor fixo uniforme.

## Decisão

- Tokens do design system (cor, tipografia, espaçamento, radius, motion/easing) vivem em `app/tokens.css`, importado no topo de `app/globals.css`. `globals.css` fica só com `@import "tailwindcss"`, resets e estilos base — não com definições de token.
- `--radius` base = `0.625rem` (10px, default do shadcn/ui), de forma que a escala derivada (`--radius-lg`) resulte em 14px — preservando a escala relativa sm/md/lg/xl da ferramenta em vez de achatar tudo num valor fixo.
- Badges, inputs e elementos pequenos usam as frações menores da escala (sm/md), não 14px.

## Consequências

- Fonte única de verdade para tokens, fácil de auditar contra o site atual (Hostinger Horizons) durante a recodificação.
- Componentes shadcn gerados via CLI continuam funcionando sem overrides manuais de radius por componente — só a variável base muda.
- Se algum componente específico do design precisar de um radius fora da escala (ex: um elemento com 14px fixo que não é `--radius-lg` por natureza), isso deve ser tratado como exceção pontual documentada, não como mudança da escala base.
