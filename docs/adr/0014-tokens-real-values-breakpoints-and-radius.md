# 0014 — Breakpoints e radius: valores reais do design system (substitui partes das ADRs 0004 e 0010)

## Status

Aceito — 2026-08-06. Supersede o conteúdo de [0010](0010-breakpoints.md) e o mecanismo de radius de [0004](0004-tokens-file-and-radius-scale.md).

## Contexto

`design-tokens.json` (fonte da verdade oficial do design system, confirmada pelo cliente) trouxe valores reais de breakpoint e radius que divergem do que havia sido assumido nas ADRs 0004 e 0010, escritas antes desse arquivo existir:

- ADR 0010 assumiu breakpoints default do Tailwind v4 (`640/768/1024/1280/1536`) por falta de um valor customizado conhecido na hora.
- ADR 0004 assumiu que o radius seria uma escala derivada de uma única variável `--radius` via `calc()` (padrão do shadcn/ui), com base em 10px pra fazer `--radius-lg` chegar a 14px.

Confirmado com o cliente: a arquitetura de pastas e a separação Server Action/DAL (ADRs 0001, 0005, 0006, 0013) permanecem como decididas — só os valores de token mudam para os reais.

## Decisão

- **Breakpoints**: `sm: 640px`, `md: 720px`, `lg: 920px`, `xl: 1200px` (sem `2xl`) — via `--breakpoint-*` no `@theme` do Tailwind v4 (`app/tokens.css`, ADR 0004), substituindo os defaults.
- **Radius**: três valores explícitos, sem derivação por `calc()` a partir de uma única variável base:
  - `--radius-sm: 7px` — inputs, badges pequenos
  - `--radius-md: 10px` — cards, botões
  - `--radius-lg: 14px` — cards grandes, painéis (form, steps)
  - Ao rodar `npx shadcn init`, a variável única `--radius` gerada pelo template padrão do shadcn é removida/substituída por essas três variáveis explícitas em `app/tokens.css`. Componentes shadcn que usam `rounded-md`/`rounded-lg` continuam funcionando normalmente — o Tailwind gera essas classes utilitárias a partir de `--radius-md`/`--radius-lg` do tema, com ou sem a fórmula `calc()` por trás.

## Consequências

- A ADR 0010 fica com status "substituída por 0014" — mantida no histórico, mas não é mais a decisão vigente sobre breakpoints.
- A ADR 0004 permanece vigente quanto à localização do arquivo de tokens (`app/tokens.css`, separado de `globals.css`) — só o mecanismo de radius nela descrito é substituído por este documento.
- `design-tokens.json` (raiz do repo) é a fonte de verdade para esses valores dali em diante — qualquer alteração de breakpoint/radius deve começar por ele, não pelo CSS diretamente.
