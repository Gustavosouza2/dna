# 0018 — Fidelidade do botão, arquitetura de componentes e codebase em inglês

## Status

Aceito — 2026-08-08. **Emendada por 0019 (2026-08-08)**: a decisão de manter as rotas públicas em português foi revertida — o cliente pediu explicitamente para traduzi-las também. `components/marketing/` também foi renomeada pra `components/sections/`. O resto (schemas/API/rate-limit em inglês, split de `components/site/` por responsabilidade, fidelidade do botão) continua válido.

## Contexto

Feedback do cliente após a rodada de melhorias da ADR 0017: os botões estavam visualmente diferentes do site original ("muita borda", quadrados demais), `components/site/` tinha virado uma pasta única com 10+ arquivos sem organização por responsabilidade, o projeto tinha nomes de arquivo/variável/schema em português misturados com convenção de código em inglês, e faltava cobertura de teste unitário para os componentes de layout/formulário (só schemas, rate-limit, ServiceCard e Reveal tinham teste).

## Decisão

**Botão (fidelidade ao design original):** `public/design-system.html` define `.btn` como pill (`border-radius:100px`), `padding:12px 22px`, `font-weight:600`, `font-size:15px`, `border:1.5px solid transparent` — o shadcn `button.tsx` gerado usava `rounded-lg`/`h-8`/`text-sm`/`font-medium`, visualmente mais próximo de um chip do que do botão original. `components/ui/button.tsx` reescrito para pill shape + padding por tamanho (`default`/`sm`/`xs`/`lg` mudam padding, não height fixo); variantes `icon-*` continuam circulares. Nova variante `whatsapp` (`bg-green-600`/`hover:bg-green-700`, cor reservada só pra CTA de WhatsApp por `design-tokens.json`) substitui os 2 lugares que faziam `className="bg-green-600 ..."` por cima da variante `default` (`app/page.tsx` hero, `app/contato/page.tsx` sidebar).

**Arquitetura de componentes:** `components/site/` (flat, 10 arquivos) dividido por responsabilidade:
- `components/layout/` — `header.tsx`, `footer.tsx`
- `components/forms/` — `form-field.tsx`, `quote-form.tsx`, `contact-form.tsx`
- `components/marketing/` — `cta-band.tsx`, `service-card.tsx`
- `components/motion/` — `reveal.tsx`
- `components/ui/` (shadcn, inalterado)

Escala melhor conforme o cliente for pedindo novas features: cada pasta cresce isoladamente, sem virar uma lista sem fim de arquivos soltos.

**Codebase em inglês (rotas públicas continuam em português):** decisão explícita do cliente — URLs (`/sobre`, `/servicos`, `/contato`, `/orcamento`, `/privacidade`, `/termos`, `/servicos/aereo|rodoviario|fluvial`) permanecem em português porque é o que visitantes e Google buscam para uma empresa brasileira; só o código por baixo virou inglês:
- `lib/schemas/orcamento.ts` → `lib/schemas/quote.ts` (`quoteSchema`/`QuoteInput`, campos `name/email/phone/origin/destination/transportType(air|road|river)/cargoType/weightVolume/consent`)
- `lib/schemas/contato.ts` → `lib/schemas/contact.ts` (`contactSchema`/`ContactInput`, campos `name/email/phone/subject/message/consent`)
- `app/api/orcamento` → `app/api/quote`, `app/api/contato` → `app/api/contact` (endpoints internos, não indexados — sem o mesmo motivo de negócio pra ficar em português que as páginas têm)
- `OrcamentoForm`/`ContatoForm` → `QuoteForm`/`ContactForm`
- chaves do rate-limit (`lib/rate-limit.ts`, chamadas em `app/api/*/route.ts`) — `"orcamento"`/`"contato"` → `"quote"`/`"contact"`
- `content/services.ts` (`ServiceSlug`, `title`, `benefits`, etc.) e as rotas de serviço **não** mudaram — o slug (`aereo`/`rodoviario`/`fluvial`) é literalmente o segmento de URL, então fica em português pela mesma razão das páginas.

**Testes:**
- Schemas/rate-limit/ServiceCard/Reveal reescritos nos novos caminhos e nomes de campo (`lib/schemas/quote.test.ts`, `lib/schemas/contact.test.ts`, `lib/rate-limit.test.ts`, `components/marketing/service-card.test.tsx`, `components/motion/reveal.test.tsx`).
- Novos testes unitários (RTL) que não existiam: `Header` (nav/active state/logo), `Footer` (links rápidos, política/termos, mailto), `CtaBand` (título/descrição/children), `FormField` (associação label/id, `aria-invalid`/`aria-describedby`), `QuoteForm`/`ContactForm` (validação client-side aparece ao submeter vazio, sem chamar a API).
- `vitest.setup.ts` ganhou um stub global no-op de `IntersectionObserver` — qualquer componente que renderiza `<Reveal>` (a maioria) quebrava em teste sem isso; `reveal.test.tsx` continua sobrescrevendo localmente pra simular o observer disparando.
- Novo `tests/contact.spec.ts` (e2e, mesmo padrão do `tests/quote.spec.ts` renomeado de `orcamento.spec.ts`): validação vazia, envio com sucesso + "Enviar outra mensagem", telefone/assunto opcionais.

## Consequências

- Toda importação de `@/components/site/*` precisou ser atualizada nas 9 páginas que usavam esses componentes — feito nesta mesma rodada, build/lint conferem que não sobrou nenhuma.
- Quem for adicionar uma feature nova (ex: um componente de depoimentos, uma seção de parceiros) tem uma pasta óbvia pra colocar: `marketing/` se for conteúdo de página, `forms/` se for formulário, `layout/` só pra chrome do site.
- `npm run test` (38 testes) e `npm run test:e2e` (5 testes, `quote.spec.ts` + `contact.spec.ts`) passam; `npm run build && npm run lint` limpos; as 10 rotas de página seguem respondendo 200.
- Se o cliente decidir no futuro migrar as URLs para inglês também, o código já está pronto (schemas/tipos não precisam mudar) — só restaria renomear as pastas de rota dentro de `app/` e adicionar redirects.
