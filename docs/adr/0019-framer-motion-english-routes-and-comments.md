# 0019 — framer-motion, rotas em inglês e comentários em inglês

## Status

Aceito — 2026-08-08

## Contexto

Feedback direto do cliente sobre a rodada anterior (ADR 0018): (1) quer `framer-motion` em vez do hook nativo de `IntersectionObserver` pras animações — reverte a decisão da ADR 0002; (2) o nome `components/marketing/` não fazia sentido pra ele; (3) as rotas continuam em português (`/contato`, `/orcamento`, `/privacidade`, `/sobre`, `/servicos`, `/termos`) e ele quer tudo em inglês — reverte a decisão explícita da ADR 0018 de manter as URLs em português; (4) os comentários no código-fonte estão em português, quer em inglês.

## Decisão

**Motion via framer-motion (reverte ADR 0002):** `components/motion/reveal.tsx` reescrito de `useScrollReveal`/`IntersectionObserver` manual pra `motion.div` com `initial`/`whileInView`/`viewport={{ once: true }}` do `framer-motion`. `lib/hooks/use-scroll-reveal.ts` removido (sem mais uso). Reduced-motion deixa de depender só do CSS global (`prefers-reduced-motion` zerando `transition-duration`, que continua existindo pra hovers/transições CSS comuns) e passa a usar o suporte nativo do framer-motion: novo `components/motion/motion-provider.tsx` (client boundary fininho) envolve `<Header>`/`<main>`/`<Footer>` em `app/layout.tsx` com `<MotionConfig reducedMotion="user">` — precisa ser um componente cliente separado porque `MotionConfig` não pode estar num arquivo que exporta `metadata` (Server Component). `--ease-motion` removido de `tokens.css`/`globals.css` (token CSS morto agora — a curva de easing vira prop `ease` do framer-motion, `[0.25, 0.1, 0.25, 1]`, fiel ao `"ease"` do CSS que `design-tokens.json` define).

**`components/marketing/` → `components/sections/`:** `cta-band.tsx` e `service-card.tsx` são blocos de seção de página (uma delas literalmente uma tag `<section>`), não tinham nada a ver com "marketing" como categoria. Pasta renomeada, imports atualizados nas 3 páginas que os usam.

**Rotas em inglês (reverte a decisão da ADR 0018 de manter em PT-BR):** decisão explícita e repetida do cliente — desta vez sem ambiguidade a resolver, ele nomeou as pastas que queria mudadas. Todas as rotas de página migraram:

| Antes | Depois |
|---|---|
| `/sobre` | `/about` |
| `/servicos` | `/services` |
| `/servicos/aereo` | `/services/air` |
| `/servicos/rodoviario` | `/services/road` |
| `/servicos/fluvial` | `/services/river` |
| `/contato` | `/contact` |
| `/orcamento` | `/quote` |
| `/privacidade` | `/privacy` |
| `/termos` | `/terms` |

Efeitos em cascata: `lib/constants.ts` (`NAV_ITEMS`/`FOOTER_NAV_ITEMS`), todo `<Link href="...">` hardcoded nas páginas e nos dois formulários (link de política de privacidade), `app/sitemap.ts`, `content/services.ts` (`ServiceSlug` virou `"air" | "road" | "river"` — mesmos valores que `QuoteInput["transportType"]` já usava desde a ADR 0018, então os dois domínios ficam consistentes agora), variantes cva do `ServiceCard`, as chamadas `getServiceBySlug()` nas 3 subpáginas de serviço, e os nomes das funções de página (`OrcamentoPage`→`QuotePage`, `ContatoPage`→`ContactPage`, `SobrePage`→`AboutPage`, `ServicosPage`→`ServicesPage`, `CargoAereoPage`→`AirCargoPage`, `TransporteRodoviarioPage`→`RoadTransportPage`, `TransporteFluvialPage`→`RiverTransportPage`, `PoliticaDePrivacidadePage`→`PrivacyPolicyPage`, `TermosPage`→`TermsPage`). Títulos de `metadata` (visíveis na aba do navegador/Google) continuam em português — são conteúdo, não código. Testes unitários (`header.test.tsx`, `footer.test.tsx`, `service-card.test.tsx`) e e2e (`tests/quote.spec.ts`, `tests/contact.spec.ts`) atualizados para as novas rotas.

**Comentários do código-fonte em inglês:** todo comentário `//`/`/* */`/JSDoc em arquivos `.ts`/`.tsx`/`.css` sob `app/`, `components/`, `lib/`, `content/`, além de `next.config.ts`, `playwright.config.ts`, `vitest.setup.ts`, traduzido pra inglês. **Documentação em Markdown (`docs/*.md`, incluindo todas as ADRs) continua em português** — são registro de decisão e comunicação com o cliente, não código; não fazem parte deste pedido.

## Consequências

- `npm install framer-motion` adicionado. Bundle ganha a dependência que a ADR 0002 evitava deliberadamente — trade-off aceito por decisão explícita do cliente, não uma reавaliação técnica.
- Qualquer link ou material de marketing que já apontasse para as URLs em português (nenhum publicado ainda — site não está em produção) ficaria quebrado; como não há histórico de indexação/backlink real, o custo de mudar agora é baixo.
- `npm run build && npm run lint && npm run test && npm run test:e2e` — todos passando; as 10 rotas de página respondendo 200 nos novos caminhos.
- Convenção fica assim, daqui pra frente: **pastas, nomes de arquivo, identificadores, comentários e mensagens de commit em inglês; conteúdo visível ao usuário (texto de página, labels, metadata) e documentação Markdown em português.**
