# 0015 — Route Handlers como BFF, substituindo Server Actions

## Status

Aceito — 2026-08-07. Substitui o mecanismo de submissão descrito na [ADR 0006](0006-orcamento-form-architecture.md) e a "Action fina" da [ADR 0013](0013-contact-form-shared-email-dal.md) (o DAL compartilhado de envio de e-mail, `sendNotificationEmail`, permanece igual).

## Contexto

Pedido explícito do cliente: usar Route Handlers como BFF em vez de Server Actions, por segurança. Vale registrar a correção técnica que motivou a conversa: Server Actions no Next.js 16 já têm proteções embutidas (checagem de CSRF via `Origin`/`Host`, IDs de ação criptografados, dead code elimination) que um Route Handler não tem de graça — a troca não é uma melhoria de segurança automática, exige reimplementar manualmente o que se perde.

Dito isso, há duas razões reais e específicas deste projeto pra preferir Route Handlers:

1. **Ops mais simples no deploy da Hostinger**: Server Actions exigem uma `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` fixa entre reinícios/deploys (ADR 0007) pra não invalidar ações em voo. Route Handlers não têm esse requisito — elimina uma fonte de erro operacional no self-hosting.
2. **Superfície de API explícita**: um endpoint REST convencional (`POST /api/orcamento`) é testável com curl/Postman, mais fácil de colocar atrás de regras de infraestrutura (WAF, rate limit por path) e não depende do protocolo interno do RSC.

## Decisão

- `app/api/orcamento/route.ts` e `app/api/contato/route.ts` — Route Handlers `POST`, substituindo `lib/actions/orcamento.ts` e `lib/actions/contato.ts` (removidos).
- `lib/security.ts` — `isTrustedOrigin()`, reimplementando manualmente a checagem `Origin` vs `Host`/`X-Forwarded-Host` que Server Actions fazem automaticamente. Todo Route Handler de formulário chama isso antes de processar.
- Ordem de checagens em cada Route Handler: origem confiável → rate limit (`lib/rate-limit.ts`, ADR 0007, chave por formulário da ADR 0013) → validação Zod → `sendNotificationEmail` (DAL, `lib/data/email.ts`, inalterado).
- Client (`OrcamentoForm`/`ContatoForm`): React Hook Form permanece no controle do submit (ADR 0006), mas agora chama `fetch("/api/orcamento", { method: "POST", body: JSON.stringify(data) })` em vez de importar e invocar uma Server Action como função. Sem `startTransition` — o próprio `isSubmitting` do RHF cobre o estado de pending durante o `await fetch`.

## Consequências

- ADR 0007 (rate limit e self-hosting): a parte sobre `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` fica obsoleta — não há mais Server Actions no projeto, logo não há IDs de ação pra invalidar entre deploys. O rate limit em memória continua válido do jeito que está.
- `isTrustedOrigin` é defesa em profundidade, não proteção crítica de CSRF clássico: o site não usa cookies de sessão/autenticação, então não há credencial ambiente pra um CSRF roubar. O risco real que isso mitiga é abuso/automação batendo direto no endpoint fora do site — complementar ao rate limit, não substituto dele.
- Testes E2E (ADR 0011) continuam funcionando sem mudança: o modo dry-run (`E2E_TEST_MODE`) vive no DAL (`sendNotificationEmail`), que nenhuma das duas arquiteturas (Action ou Route Handler) contorna.
- Se o site precisar de autenticação/sessão no futuro, `isTrustedOrigin` deixa de ser suficiente sozinho — revisitar com CSRF token ou double-submit cookie nesse cenário.
