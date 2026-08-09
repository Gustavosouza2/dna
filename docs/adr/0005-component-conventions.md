# 0005 — Convenções de componente (shadcn/ui, cva, Server Actions)

## Status

Aceito — 2026-08-06. **Estilo shadcn emendado em 2026-08-06 na implementação**: `new-york` não existe mais no CLI instalado (`shadcn@4.16.2`) — essa geração da ferramenta roda sobre `@base-ui/react` (não Radix) com um sistema de presets novo (`nova, vega, maia, lyra, mira, luma, sera, rhea`, sem `new-york`/`default`). Usado o preset default do próprio CLI (`nova`, via `shadcn init -d`), já que os presets controlam convenções internas dos componentes gerados, não cor/radius/fonte — esses continuam vindo dos nossos tokens de marca (ADR 0003/0004/0014), sobrepostos na camada semântica (`--primary`, `--border`, etc.) em `app/globals.css`. Restante da decisão (cva pra variantes do site, `cn()` em `lib/utils.ts`, kebab-case/PascalCase, Action/DAL) permanece válido. **Organização de `components/site/` emendada por 0018**: a pasta única virou `components/{layout,forms,marketing,motion}/` por responsabilidade — kebab-case/PascalCase e cva continuam os mesmos.

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
