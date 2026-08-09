# ADRs — Dna Air Cargo (site institucional)

Registro de decisões de arquitetura tomadas durante a sessão de grilling (2026-08-06), antes de iniciar a implementação da recodificação do site.

| # | Decisão |
|---|---|
| [0001](0001-project-structure.md) | Estrutura de pastas raiz sem `src/` |
| [0002](0002-motion-scroll-reveal.md) | Scroll-reveal via hook nativo (Intersection Observer), sem lib de animação |
| [0003](0003-tokens-light-only.md) | Design tokens: tema único (light), sem dark mode |
| [0004](0004-tokens-file-and-radius-scale.md) | Arquivo de tokens separado e escala de radius do shadcn/ui *(radius emendado por 0014)* |
| [0005](0005-component-conventions.md) | Convenções de componente (shadcn/ui, cva, Action/DAL) |
| [0006](0006-orcamento-form-architecture.md) | Formulário de orçamento: React Hook Form no controle *(submit via Route Handler desde 0015)* |
| [0007](0007-rate-limit-and-self-hosting.md) | Rate limiting em memória *(parte da chave de encriptação obsoleta por 0015)* |
| [0008](0008-security-headers.md) | CSP estática (sem nonce) e headers de segurança via next.config.ts |
| [0009](0009-lgpd-consent-and-data-flow.md) | LGPD: sem persistência própria, consentimento obrigatório, transferência internacional declarada |
| [0010](0010-breakpoints.md) | ~~Breakpoints padrão do Tailwind v4~~ *(substituída por 0014)* |
| [0011](0011-testing-strategy.md) | Estratégia de testes: Vitest (unit) + Playwright (e2e), Resend em dry-run |
| [0012](0012-seo-metadata-and-jsonld.md) | Metadata estático por página, sitemap/robots fixos, JSON-LD no layout raiz |
| [0013](0013-contact-form-shared-email-dal.md) | Formulário de Contato: schema próprio, DAL de envio de e-mail compartilhado |
| [0014](0014-tokens-real-values-breakpoints-and-radius.md) | Breakpoints e radius: valores reais do design system (substitui partes de 0004 e 0010) |
| [0015](0015-route-handlers-as-bff.md) | Route Handlers como BFF, substituindo Server Actions |
| [0016](0016-content-fidelity-pass.md) | Fidelidade de conteúdo: textos reais do site atual, rename de rota, `/termos` |
| [0017](0017-improvement-pass.md) | Rodada de melhorias: a11y, UI, performance, padrões e testes |
| [0018](0018-english-codebase-and-component-architecture.md) | Fidelidade do botão, arquitetura de componentes por pasta, codebase em inglês *(rotas emendadas por 0019)* |
| [0019](0019-framer-motion-english-routes-and-comments.md) | framer-motion no lugar do hook nativo, rotas públicas traduzidas para inglês, `components/sections/`, comentários do código em inglês |

Ver termos de domínio e arquitetura em [../glossary.md](../glossary.md).
