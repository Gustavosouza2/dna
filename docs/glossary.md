# Glossário — Dna Air Cargo (site institucional)

Termos de domínio e de arquitetura usados neste projeto. Ver decisões completas nas ADRs em `docs/adr/`.

## Domínio (transportadora)

- **Recodificação (não redesign)**: reescrita do site em código próprio mantendo fidelidade visual ao design atual (feito em Hostinger Horizons), com melhorias pontuais. Não é uma reformulação visual. Ver [0001](adr/0001-project-structure.md).
- **Orçamento**: fluxo principal de conversão do site — formulário onde o visitante pede cotação de frete (nome, e-mail, telefone, origem, destino, tipo de transporte, tipo de carga, peso/volume). Ver [0006](adr/0006-orcamento-form-architecture.md).
- **Formulário de Contato**: segundo formulário do site (nome, e-mail, telefone opcional, assunto opcional, mensagem), na página Contato, para dúvidas/solicitações que não são pedidos de orçamento estruturados. Schema e Action próprios, reusando o DAL de envio de e-mail do orçamento. Ver [0013](adr/0013-contact-form-shared-email-dal.md).

## Arquitetura

- **DAL (Data Access Layer)**: camada em `lib/data/` que concentra regra de negócio e chamadas a serviços externos (ex: Resend), mantendo as Server Actions (`lib/actions/`) finas — só parseiam/validam e delegam. Ver [0005](adr/0005-component-conventions.md).
- **`<Reveal>`**: componente cliente único responsável por scroll-reveal (Intersection Observer nativo), fronteira `"use client"` isolada do resto do site (que é Server Component por padrão). Ver [0002](adr/0002-motion-scroll-reveal.md).
- **`proxy.ts`**: convenção do Next.js 16 que substitui o antigo `middleware.ts` (renomeado, mesmo comportamento). Relevante para a decisão de CSP (nonce via proxy vs. estática via `next.config.ts`). Ver [0008](adr/0008-security-headers.md).
- **CSP estática**: Content-Security-Policy definida em `next.config.ts`, sem nonce, para preservar geração estática nas páginas institucionais — trade-off de `'unsafe-inline'`. Ver [0008](adr/0008-security-headers.md).
- **Dry-run (Resend)**: modo de teste (`E2E_TEST_MODE=true`) em que a Server Action de orçamento loga o payload em vez de chamar a API do Resend, usado nos testes E2E para não disparar e-mails reais. Ver [0011](adr/0011-testing-strategy.md).
- **`sendNotificationEmail`**: função única do DAL (`lib/data/email.ts`) que concentra a chamada à API do Resend (client, dry-run, tratamento de erro), reusada pelas Actions de orçamento e de contato. Ver [0013](adr/0013-contact-form-shared-email-dal.md).
