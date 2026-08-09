# 0017 — Rodada de melhorias: a11y, UI, performance, padrões e testes

## Status

Aceito — 2026-08-08

## Contexto

Depois da fidelidade de conteúdo (ADR 0016), foi feita uma auditoria completa (UX, UI, performance, acessibilidade, padrões de código) e todos os achados de impacto real foram implementados — em 4 processos paralelos (fork), cada um dono de um conjunto de arquivos sem sobreposição, mais dois componentes compartilhados criados antes (`CtaBand`, `FormField`) pra evitar duplicação entre os processos.

## Decisão

**Componentes novos compartilhados:**
- `components/site/cta-band.tsx` — faixa de CTA final (fundo azul, título+descrição+botões), estava duplicada de forma independente em Home/Sobre/Serviços. Usada nas três agora.
- `components/site/form-field.tsx` — `Label`+campo+erro com `id`/`htmlFor`/`aria-invalid`/`aria-describedby` gerados via `useId()` e injetados no filho via `cloneElement`. Substitui a função `Field` local que cada formulário reimplementava (com o mesmo bug de a11y duplicado nos dois).

**Acessibilidade (`orcamento-form.tsx`, `contato-form.tsx`):**
- Label associado corretamente a cada campo (era o achado de maior impacto da auditoria — sem isso, leitor de tela não anunciava o rótulo).
- `aria-invalid`/`aria-describedby` nos campos com erro, incluindo o `Select` de tipo de transporte (tratado manualmente, não é um input simples).
- Mensagens de sucesso/erro numa região `aria-live="polite"`.
- Corrigido de brinde: `Select` de `tipoTransporte` fazia a transição uncontrolled→controlled (warning do React/base-ui) porque `field.value` começava `undefined` — `value={field.value ?? null}` resolve.

**UX:**
- Botão "Enviar outra solicitação/mensagem" na tela de sucesso dos dois formulários (antes só dava pra reload manual da página).
- Link "← Todos os serviços" no topo das 3 subpáginas de serviço (não são mais linkadas em nav/footer desde a ADR 0016, precisavam de um caminho de volta pra quem chega direto).

**UI:**
- Grids de 3+ colunas que pulavam de 1 pra 3/4 sem meio-termo ganharam o degrau `sm:grid-cols-2` (Home features, Sobre "valores"/"por que escolher").
- `<h2 className="sr-only">` antes dos cards de feature da Home — corrige o pulo h1→h3 sem mudar o visual.
- Badges de destaque e ícones pequenos (Serviços, Sobre) trocados de `rounded-lg` (14px, teto da escala) pra `rounded-md` (10px) — radius grande reservado pra cards/painéis de verdade.

**Performance:**
- Hero da Home e as 4 imagens editoriais (equipe, 3x serviço) migradas de `<img>` cru pra `next/image` (`fill`+`sizes`, `priority` só no hero por ser o LCP da página).
- `JetBrains Mono` removida do layout raiz — carregava em toda página sem nenhum uso real no site (só existia no `design-system.html` de referência). `font-display: "swap"` explicitado nas duas fontes que ficaram (Manrope, Inter).

**Testes (ADR 0011, implementação que ainda não tinha sido feita):**
- `vitest.config.mts` + `playwright.config.ts` (com `E2E_TEST_MODE=true` no `webServer`, garantindo que o e2e nunca dispara e-mail real).
- Unit: schemas Zod (orçamento/contato), `rate-limit`, `ServiceCard` por variante, `Reveal`/`useScrollReveal` (com `IntersectionObserver` mockado) — 24 testes.
- E2E: fluxo completo do formulário de orçamento na UI real (validação vazia → preenchimento → sucesso → "Enviar outra solicitação") — 2 testes, seam único conforme a ADR 0011.

## Consequências

- `npm run test` (Vitest) e `npm run test:e2e` (Playwright) agora existem e passam — projeto deixa de ter zero cobertura de teste.
- `content/services.ts`/`app/page.tsx`/`app/sobre/page.tsx`/`app/servicos/page.tsx` e as 3 subpáginas, mais os dois formulários, foram tocados nesta rodada — qualquer PR futuro que mexer nesses arquivos deve rodar `npm run build && npm run lint && npm run test` antes de subir (o `test:e2e` precisa do Chromium do Playwright instalado, `npx playwright install chromium`).
- Achados da auditoria **não** implementados nesta rodada (fora de escopo por decisão, não por esquecimento): remover a redundância "cards resumidos da Home + botão Ver todos + página Serviços completa" (ambíguo o que mudar sem mais direção do cliente); separar `ServiceContent` em `ServiceSummary`/`ServiceDetail` (documentação via JSDoc foi considerada suficiente por ora); confirmar a cor oficial de `--destructive` (segue pendente do cliente, ver `app/globals.css`).
