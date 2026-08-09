# 0016 — Fidelidade de conteúdo: textos reais extraídos do site atual, rename de rota, /termos

## Status

Aceito — 2026-08-07

## Contexto

O cliente forneceu o HTML renderizado da Home do site atual em produção. Isso revelou, além de textos que eu tinha escrito como placeholder (ADR 0001, `content/services.ts`), duas coisas estruturais que a recodificação precisava respeitar por fidelidade:

- O header do site atual não tem botões de CTA (WhatsApp/Orçamento) — só 5 links de navegação (Home, Serviços, Solicitar orçamento, Contato, Sobre) + menu mobile.
- O footer linka para `/privacidade` e `/termos`, não para `/politica-de-privacidade` (rota que eu tinha inventado sem essa referência).

## Decisão

- `content/services.ts`, Home (`app/page.tsx`), Header e Footer reescritos com o texto real extraído do DOM (hero, seção de features com 3 cards — Segurança/Pontualidade/Crescimento —, cards de serviço com bullets, CTA final, textos do footer).
- Imagem de fundo do hero baixada e self-hosted em `public/images/hero-operacao.jpg` (era hotlink direto pro Unsplash no site atual — self-hosting evita depender de domínio externo e não exige abrir `img-src` no CSP da ADR 0008 pra um domínio de terceiro).
- Logo (header e footer) usa o ícone `PlaneIcon` do lucide-react + texto — é literalmente o mesmo SVG (`lucide-plane`) que o site atual usa, não um asset novo.
- Header vira Client Component (`usePathname` pra estado ativo do link + `Sheet` do shadcn pro menu mobile) — desvio pontual da regra geral da ADR 0002 ("resto do site é Server Component por padrão"), justificado porque replicar o estado de link ativo do site atual exige saber a rota corrente no client.
- `NAV_ITEMS` (header) inclui "Solicitar orçamento"; `FOOTER_NAV_ITEMS` (footer, lista menor, sem Contato) é uma constante separada — os dois têm listas diferentes no site atual.
- Rota `/politica-de-privacidade` renomeada para `/privacidade`, em todas as referências (ADR 0009, ADR 0012, `sitemap.ts`, links nos formulários).
- Nova rota `/termos` (Termos de Uso) criada como stub — existe no site atual (linkada no footer), mas o conteúdo real não estava disponível no HTML analisado. Mesmo tratamento da Política de Privacidade: estrutura pronta, texto marcado como pendente de revisão.

## Consequências

- `docs/specs/recodificacao-site-institucional.md` deve ganhar uma user story para `/termos` e uma nota sobre o conteúdo pendente (mesma natureza da nota já existente sobre a Política de Privacidade).
- Qualquer novo componente/página deve conferir o HTML de origem (quando disponível) antes de escrever copy nova — não inventar texto quando há fonte real para extrair.

## Atualização — 2026-08-08: Sobre, Serviços, Contato

O cliente forneceu também o HTML real de Sobre, Serviços e Contato. As três páginas foram reescritas em paralelo (subagents forked, um por página, mesmo contexto/regras de tradução desta ADR) a partir desse HTML:

- **Sobre** (`app/sobre/page.tsx`): hero, faixa de stats, "Nossa missão" (com foto — `public/images/equipe-sobre.jpg`, self-hosted), "Nossos valores" (4 cards), "Por que escolher" (3 diferenciais), CTA final. `STATS` (`lib/constants.ts`) corrigido pro texto real: `"2.847"` (com ponto), labels capitalizados ("Anos de experiência" etc.).
- **Serviços** (`app/servicos/page.tsx`): reescrita como página única rica com as 3 modalidades detalhadas em seções alternadas (imagem esquerda/direita), cada uma com 3 badges de destaque e 6 benefícios — não é mais uma grade simples linkando pra subpáginas. `content/services.ts` expandido (`longDescription`, `image`, `highlights`, `benefits` de 4→6 itens) de forma aditiva — `ServiceCard`/Home não precisaram mudar. As subpáginas `/servicos/{aereo,rodoviario,fluvial}` continuam existindo (não linkadas em nav/footer no site real, mas válidas por SEO via `sitemap.ts`) e herdam os benefícios expandidos automaticamente. Imagens self-hosted: `public/images/servico-{aereo,rodoviario,fluvial}.jpg`.
- **Contato** (`app/contato/page.tsx`): só o layout foi reconstruído (hero + grid 3 colunas, sidebar com 3 cards — Informações de contato, Atendimento rápido/WhatsApp, Localização com placeholder de mapa). O `<ContatoForm />` existente (RHF + Zod + `/api/contato` + checkbox de consentimento LGPD, ADR 0009/0013/0015) **não foi alterado** — o HTML original não mostra o checkbox de consentimento, mas ele foi mantido de propósito (exigência de conformidade, não gap de fidelidade).

Regra de tradução de cor consolidada nas 3 páginas: `text-primary`/`bg-primary` → `blue-600`; `text-muted-foreground` → `slate-600`; `bg-muted` → `bg-bg`; `bg-card` → `bg-white`/`border-line`; `text-secondary`/`bg-secondary` → `blue-600` **exceto** botões que são literalmente CTA de WhatsApp, que usam `green-600`/`green-700` (verde continua exclusivo disso, regra do design-tokens.json). Radius do HTML original (`rounded-2xl`/`rounded-3xl`) capado em `rounded-lg` (14px, teto do design system) em todas as três.
