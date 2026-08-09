# 0012 — Metadata estático por página, sitemap/robots fixos, JSON-LD no layout raiz

## Status

Aceito — 2026-08-06

## Contexto

Todas as rotas do site são fixas (sem `[slug]` dinâmico, sem CMS): Home, Serviços (aéreo/rodoviário/fluvial), Orçamento, Contato, Sobre, e `/privacidade` (ADR 0009).

## Decisão

- `export const metadata` estático em cada `page.tsx` — sem `generateMetadata`, que só se justifica quando o metadata depende de dado buscado em runtime (não é o caso aqui).
- `app/sitemap.ts` e `app/robots.ts` (convenção de arquivo do Next, gerados via código) listando as rotas fixas do site.
- JSON-LD `LocalBusiness` renderizado no **layout raiz** (`app/layout.tsx`), presente em toda página — nome, endereço, telefone, horário são dados estáticos institucionais que não variam por rota. Sanitizado contra XSS (`JSON.stringify(jsonLd).replace(/</g, '\\u003c')`) por usar `dangerouslySetInnerHTML`, conforme o guia oficial de JSON-LD do Next.js.

## Consequências

- Nenhuma página precisa de lógica de fetch para montar seu metadata.
- JSON-LD `LocalBusiness` aparece em todas as páginas, reforçando SEO local independente do ponto de entrada do crawler.
- Se o site ganhar conteúdo dinâmico no futuro (ex: blog, páginas geradas por CMS), esta ADR deve ser revisitada para introduzir `generateMetadata` nessas rotas específicas.
