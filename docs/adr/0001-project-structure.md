# 0001 — Estrutura de pastas raiz sem `src/`

## Status

Aceito — 2026-08-06

## Contexto

O projeto é uma recodificação 1:1 (não redesign) do site institucional da Dna Air Cargo: ~7 rotas públicas, sem multi-tenant, sem múltiplos times de desenvolvimento, sem necessidade de separar "app code" de "config" por volume. Next.js 16 (App Router) não exige `src/`; é uma escolha organizacional.

## Decisão

- Sem pasta `src/`. `app/` fica na raiz do projeto.
- `components/ui/` — primitivos shadcn/ui (gerados via `npx shadcn add`, praticamente não editados à mão).
- `components/site/` — blocos específicos do site (header, footer, hero, cards de serviço, seções reutilizáveis entre páginas).
- `lib/` — schemas Zod, Server Actions, rate limiting, utilitários.
- `content/` — textos institucionais centralizados, se necessário (a confirmar durante a modelagem de conteúdo).
- Colocation de subcomponentes usados em uma única rota: `app/<rota>/_components/` (prefixo `_` para não virar rota).

## Consequências

- `components.json` do shadcn aponta para fora de `app/`, seguindo a convenção padrão da ferramenta.
- Poucos arquivos de configuração na raiz (next.config.ts, eslint.config.mjs, sem tailwind.config — Tailwind v4 é CSS-first), então a pressão visual que `src/` resolveria não existe aqui.
- Se o projeto crescer para múltiplos apps/times no mesmo repo, essa decisão deve ser revisitada.
