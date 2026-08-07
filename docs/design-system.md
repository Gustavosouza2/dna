# Design System — Dna Air Cargo

Referência viva dos tokens visuais do site (v2 fiel ao site atual, não a exploração v3 descartada).

- **Tokens (fonte da verdade)**: [`design-tokens.json`](../design-tokens.json), na raiz do repo — cor, tipografia, espaçamento, radius, shadow, breakpoint, motion. `tailwind.config`/`globals.css` (ou `app/tokens.css`, conforme ADR 0004) devem ler valores daqui, não redefinir em paralelo.
- **Página viva**: `public/design-system.html`, servida em `/design-system.html` — HTML+CSS autocontido (sem dependência do pipeline Tailwind do app), mostra cada token renderizado (swatches de cor, escala tipográfica, botões, card, input, espaçamento, radius) e a seção "Fora do padrão" com o que foi descartado do v3 e não deve voltar sem aprovação explícita.
  - Marcada `noindex, nofollow` — é referência interna, não uma página do site institucional.

## Regras

- Não introduzir cores fora da paleta de `design-tokens.json` sem atualizar o arquivo primeiro.
- Radius máximo 14px — nunca acima disso.
- `green-600` é reservado exclusivamente para CTA de WhatsApp.
- Motion é utilitário (hover, transição de estado, scroll-reveal já existente no site atual), nunca decorativo novo — sem glow, parallax ou HUD animado. Deve respeitar `prefers-reduced-motion`.
- Elementos do v3 descartados (nav pílula flutuante com blur, grid bento assimétrico, cards flutuando com animação contínua, marquee de parceiros, glassmorphism) não voltam sem aprovação explícita — ver seção "Fora do padrão" em `/design-system.html`.

## Reconciliação com as ADRs (2026-08-06)

Uma árvore de pastas de referência e este `design-tokens.json` chegaram junto, divergindo em alguns pontos do que já havia sido decidido na sessão de grilling. Resolvido com o cliente:

- **Tokens são definitivos**: os valores reais de `design-tokens.json` substituem o que havia sido assumido antes de o arquivo existir — breakpoints e radius. Ver [ADR 0014](adr/0014-tokens-real-values-breakpoints-and-radius.md), que supera essas partes de [0004](adr/0004-tokens-file-and-radius-scale.md) e [0010](adr/0010-breakpoints.md).
- **Arquitetura de pastas permanece como já decidida**: sem `src/` ([0001](adr/0001-project-structure.md)), Server Action chamada pelo React Hook Form + separação Action/DAL (`lib/actions/` + `lib/data/`, [0005](adr/0005-component-conventions.md)/[0006](adr/0006-orcamento-form-architecture.md)/[0013](adr/0013-contact-form-shared-email-dal.md)). A árvore com `src/` e `app/api/contato/route.ts` era uma referência anterior, não a decisão vigente.
