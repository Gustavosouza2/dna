# 0011 — Estratégia de testes: Vitest (unit) + Playwright (e2e), Resend em dry-run

## Status

Aceito — 2026-08-06

## Contexto

Requisito: testes unitários por componente + e2e do fluxo de orçamento. O guia oficial de testing do Next.js 16 indica Vitest + React Testing Library para unit e Playwright para E2E, e avisa que Vitest ainda não suporta Server Components `async` (recomenda E2E para esses) — não é um problema relevante aqui porque as páginas institucionais são majoritariamente Server Components síncronos.

Ponto corrigido durante a sessão: a primeira proposta era interceptar a chamada ao Resend via `page.route()` do Playwright. Isso está errado para esta arquitetura — a chamada ao Resend acontece dentro da Server Action, no processo Node do servidor, não como fetch/XHR do browser. `page.route()` só intercepta requisições iniciadas pelo browser, então nunca veria essa chamada.

## Decisão

- **Unit (Vitest + React Testing Library)**, arquivo de teste colocado ao lado do componente (`service-card.tsx` + `service-card.test.tsx`), cobrindo:
  - `ServiceCard` e outras variantes cva (renderizam a variante certa por prop).
  - Schema Zod do orçamento (`lib/schemas/orcamento.ts`) — casos válidos/inválidos isolados, sem UI.
  - Comportamento do form via RHF (erros de validação aparecem nos campos certos, submit some/desabilita durante pending) — Server Action mockada nesse nível.
  - `useScrollReveal`/`<Reveal>`, com `IntersectionObserver` mockado (jsdom não implementa nativamente).
- **E2E (Playwright)**, cobrindo o fluxo completo de orçamento: preencher, validação client-side, submit, estado de sucesso/erro.
- **Resend em modo dry-run durante testes**: a Server Action (`lib/actions/orcamento.ts`) verifica uma flag de ambiente (`E2E_TEST_MODE=true`) e, se ativa, loga o payload e retorna sucesso sem chamar a API do Resend. Menor fidelidade de integração de rede real, mas zero setup de mock server e sem risco de e-mails reais disparados em CI.

## Consequências

- Nenhum teste (unit ou e2e) dispara e-mail real via Resend.
- A chamada real à API do Resend (formato de request, tratamento de erro de rede, etc.) não é exercida por nenhum teste automatizado — fica coberta apenas manualmente/por verificação em produção. Se isso virar um risco relevante, revisitar esta ADR para adicionar um mock HTTP local (servidor fake que a Action aponta via URL base configurável).
- `E2E_TEST_MODE` precisa estar **desligada** em produção — checar isso explicitamente no processo de deploy/checklist, já que uma flag esquecida ligada em produção significaria formulários "com sucesso" que nunca enviam e-mail de verdade.
