# 0013 — Formulário de Contato: schema/Action próprios, DAL de envio de e-mail compartilhado

## Status

Aceito — 2026-08-06. **"Server Actions" substituídas por Route Handlers na [ADR 0015](0015-route-handlers-as-bff.md)** — `lib/actions/*` viraram `app/api/*/route.ts`. O DAL compartilhado (`sendNotificationEmail`) e a separação de schemas/rate-limit por formulário descritos abaixo continuam exatamente iguais.

## Contexto

Além do formulário de orçamento (ADR 0006), a página Contato tem um segundo formulário (nome, e-mail, telefone opcional, assunto opcional, mensagem) para dúvidas/solicitações que não são pedidos de orçamento estruturados. Os campos dos dois formulários são genuinamente diferentes (orçamento tem campos estruturados de rota/carga; contato tem texto livre), mas ambos terminam da mesma forma: validar, checar rate limit, montar e enviar um e-mail via Resend.

## Decisão

- Schemas Zod separados: `lib/schemas/orcamento.ts` e `lib/schemas/contato.ts` — não um schema único parametrizado por "tipo de formulário", porque os campos divergem o suficiente pra isso virar uma pilha de opcionais condicionais.
- Server Actions separadas: `lib/actions/orcamento.ts` e `lib/actions/contato.ts` — cada uma fina, parseando/validando seu próprio formato e montando assunto/corpo do e-mail correspondente.
- DAL de envio compartilhado: `lib/data/email.ts` expõe `sendNotificationEmail({ to, subject, html })`, único ponto que chama a API do Resend (client, tratamento de erro, modo dry-run da ADR 0011) — reusado pelas duas Actions.
- Rate limiting (`lib/rate-limit.ts`, ADR 0007) com contadores **separados por formulário** — chave inclui o nome do form (ex: `orcamento:<ip>`, `contato:<ip>`), para que abuso em um formulário não consuma a cota do outro.

## Consequências

- Nenhuma duplicação de lógica de chamada ao Resend (client, dry-run, tratamento de erro) entre os dois formulários.
- Adicionar um terceiro formulário no futuro segue o mesmo padrão: schema + Action própria, reusando `sendNotificationEmail`.
- Os dois formulários compartilham o mesmo modo dry-run (`E2E_TEST_MODE`, ADR 0011) automaticamente, por estarem atrás do mesmo DAL — nenhum teste e2e do formulário de Contato dispara e-mail real, pela mesma razão que o de orçamento não dispara.
