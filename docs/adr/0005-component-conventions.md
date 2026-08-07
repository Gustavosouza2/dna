# 0005 — Convenções de componente (shadcn/ui, cva, Server Actions)

## Status

Aceito — 2026-08-06

## Contexto

O projeto usa shadcn/ui como base de componentes. Além dos primitivos gerados pela CLI, o site tem componentes próprios com variantes (ex: cards de serviço aéreo/rodoviário/fluvial — mesma estrutura, cor de destaque e ícone diferentes por variante).

## Decisão

- shadcn/ui instalado com estilo `new-york`. Componentes gerados em `components/ui/`, tratados como código gerado (atualizar via CLI, não editar à mão salvo necessidade pontual documentada).
- `cn()` (clsx + tailwind-merge) em `lib/utils.ts`, conforme padrão assumido pelo `components.json` do shadcn.
- Variantes de componentes do site (ex: `ServiceCard` com variante aéreo/rodoviário/fluvial) usam `class-variance-authority` (cva) — mesma lib que os componentes shadcn já usam internamente. Um único padrão de variante no projeto, não dois.
- Nomes de arquivo em kebab-case (`service-card.tsx`), export nomeado em PascalCase (`ServiceCard`).
- Server Actions centralizadas em `lib/actions/` (ex: `lib/actions/orcamento.ts`) — camada fina: parseia `FormData`, valida forma, chama o DAL. Regra de negócio e chamada a serviços externos (Resend) ficam em `lib/data/` (Data Access Layer), conforme o guia de Data Security do Next.js.

## Consequências

- Componentes de UI reusáveis com múltiplas variantes (cards de serviço, badges de status, etc.) seguem sempre o mesmo padrão cva, reduzindo decisão repetida por componente.
- A separação Action/DAL (0002 em `docs/adr`, análoga ao padrão do guia oficial) facilita testar a lógica de negócio isoladamente da camada de Server Action, e mantém a Action auditável (fácil ver o que precisa de auth/validação vs o que é lógica).
