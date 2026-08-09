# Spec — Recodificação do site institucional (Dna Air Cargo)

> Rastreador de issues não configurado neste repo (sem `git remote`, `/setup-matt-pocock-skills` não concluído). Spec publicada como arquivo local em vez de issue — sem label de triage aplicada.

## Problem Statement

O site institucional atual da Dna Air Cargo (transportadora de cargas aérea/rodoviária/fluvial no Brasil) foi construído num builder de IA (Hostinger Horizons). Isso deixa o cliente sem controle de código próprio, dificultando manutenção, evolução e correções — e não dá nenhuma garantia sobre performance, acessibilidade, segurança ou SEO, que dependem inteiramente do que o builder gera.

## Solution

Recodificação (não redesign) do site em código próprio — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, React Hook Form + Zod, Resend — mantendo fidelidade visual ao design atual e ao design system já definido pelo cliente (tokens de cor, tipografia Manrope+Inter, espaçamento, radius máximo 14px, motion com scroll-reveal), com melhorias pontuais onde fizer sentido (segurança, SEO, testes automatizados, conformidade LGPD), hospedado na Hostinger.

Decisões de arquitetura completas estão registradas em `docs/adr/` (índice em `docs/adr/README.md`); vocabulário de domínio em `docs/glossary.md`.

## User Stories

1. Como visitante, quero ver a Home do site, para entender rapidamente o que a Dna Air Cargo faz e quais serviços oferece.
2. Como visitante, quero navegar até a página de Serviços, para conhecer as modalidades de transporte disponíveis.
3. Como visitante, quero ver a subpágina de transporte Aéreo, com seus benefícios e um CTA, para decidir se esse serviço atende minha necessidade.
4. Como visitante, quero ver a subpágina de transporte Rodoviário, com seus benefícios e um CTA, para decidir se esse serviço atende minha necessidade.
5. Como visitante, quero ver a subpágina de transporte Fluvial, com seus benefícios e um CTA, para decidir se esse serviço atende minha necessidade.
6. Como visitante interessado, quero acessar a página de Solicitar Orçamento a partir de qualquer página de serviço, para pedir uma cotação sem perder o contexto.
7. Como visitante, quero preencher um formulário de orçamento (nome, e-mail, telefone, origem, destino, tipo de transporte, tipo de carga, peso/volume), para receber uma cotação da Dna Air Cargo.
8. Como visitante preenchendo o formulário, quero ver erros de validação por campo em tempo real, para corrigir o preenchimento antes de tentar enviar.
9. Como visitante, quero ver um estado de carregamento claro enquanto o formulário está sendo enviado, para saber que minha solicitação está em processamento.
10. Como visitante, quero ver uma confirmação clara de que meu pedido de orçamento foi enviado com sucesso, para ter certeza de que a Dna Air Cargo vai me responder.
11. Como visitante, quero ver uma mensagem de erro clara se o envio falhar, para saber que preciso tentar de novo ou usar outro canal de contato.
12. Como visitante, quero marcar um checkbox de consentimento explícito antes de enviar meus dados pessoais, para exercer controle sobre o uso das minhas informações conforme a LGPD.
13. Como visitante, quero não conseguir enviar o formulário sem marcar o consentimento, para que a coleta de dados nunca aconteça sem minha concordância explícita.
14. Como visitante, quero acessar a página de Política de Privacidade a partir do link no checkbox de consentimento, para entender o que acontece com meus dados.
15. Como visitante lendo a Política de Privacidade, quero saber que meus dados são processados por um serviço de envio de e-mail sediado nos EUA (Resend), para estar ciente da transferência internacional dos meus dados.
16. Como visitante, quero acessar a página de Contato, para encontrar outros canais de comunicação com a Dna Air Cargo.
17. Como visitante, quero acessar a página Sobre, para conhecer a missão da empresa.
18. Como visitante na página Sobre, quero ver estatísticas da empresa (15+ anos, 2847 clientes, 97% de pontualidade, atendimento 24/7), para avaliar a credibilidade da Dna Air Cargo antes de solicitar um orçamento.
19. Como visitante em qualquer dispositivo (celular, tablet, desktop), quero que o site se adapte ao tamanho da minha tela, para ter uma boa experiência independente do dispositivo.
20. Como visitante rolando a página, quero ver seções aparecerem com uma transição suave (scroll-reveal), para uma experiência visual mais polida, consistente com o design system da marca.
21. Como responsável pela Dna Air Cargo, quero receber por e-mail cada solicitação de orçamento enviada pelo site, para poder responder ao cliente potencial.
22. Como responsável pela Dna Air Cargo, quero que o site apareça bem posicionado em buscas relevantes (transportadora aérea/rodoviária/fluvial no Brasil), para gerar mais leads orgânicos.
23. Como motor de busca (crawler), quero encontrar um `sitemap.xml` e um `robots.txt`, para indexar as páginas do site corretamente.
24. Como motor de busca (crawler) ou assistente de IA, quero encontrar dados estruturados (JSON-LD `LocalBusiness`) em todas as páginas, para entender a identidade da empresa (nome, endereço, telefone, horário de atendimento).
25. Como responsável pela Dna Air Cargo, quero que o formulário de orçamento seja protegido contra abuso (envios automatizados em massa), para não ter minha caixa de entrada e minha cota de envio de e-mail (Resend) sobrecarregadas.
26. Como responsável pela Dna Air Cargo, quero que o site sirva as páginas por HTTPS com headers de segurança adequados, para proteger os visitantes contra ataques comuns (clickjacking, MIME sniffing, etc.).
27. Como desenvolvedor mantendo o projeto, quero testes automatizados unitários por componente, para detectar regressões em variantes de componente e lógica de validação sem depender só de QA manual.
28. Como desenvolvedor mantendo o projeto, quero um teste e2e do fluxo completo de orçamento, para garantir que o caminho de conversão mais importante do site nunca quebre silenciosamente.
29. Como desenvolvedor rodando a suíte de testes, quero que nenhum teste dispare um e-mail real via Resend, para poder rodar a suíte livremente (inclusive em CI) sem gerar ruído ou custo.
30. Como desenvolvedor implementando novas páginas/componentes, quero seguir os tokens de design já definidos (cor, tipografia, espaçamento, radius, motion), para manter fidelidade visual ao site atual sem redecidir isso a cada componente.
31. Como visitante, quero preencher um formulário de contato (nome, e-mail, telefone opcional, assunto opcional, mensagem), para enviar uma dúvida ou solicitação que não é especificamente um pedido de orçamento.
32. Como visitante na página Contato, quero ver telefone, e-mail, endereço e horário de atendimento da empresa, para escolher o canal mais conveniente.
33. Como visitante que precisa de resposta imediata, quero um botão de WhatsApp em destaque na página Contato, para contato direto sem esperar resposta por e-mail.
34. Como visitante, quero acessar a página de Termos de Uso a partir do footer, para entender as condições de uso do site.

## Implementation Decisions

Decisões completas com contexto e consequências em `docs/adr/` (0001–0012). Resumo:

- **Estrutura de pastas** (`0001`): sem `src/`; `app/` na raiz; `components/ui/` (shadcn, gerado) e `components/site/` (blocos próprios do site); `app/api/*/route.ts` (Route Handlers, finos — ADR 0015) e `lib/data/` (Data Access Layer — regra de negócio, chamada ao Resend); colocation de subcomponentes de rota única em `app/<rota>/_components/`.
- **Motion / scroll-reveal** (`0002`): hook `useScrollReveal` (Intersection Observer nativo) + componente `<Reveal>` (`"use client"`), sem dependência de `framer-motion`. É o único ponto de fronteira cliente para motion — o resto do site é Server Component por padrão.
- **Design tokens** (`0003`, `0004`): tema único, sem dark mode (bloco `prefers-color-scheme` do scaffold removido). Tokens centralizados em `app/tokens.css` (Tailwind v4 `@theme inline`), separado de `globals.css`. `--radius` base em `0.625rem` (10px), de forma que `--radius-lg` (cards/botões grandes) resulte em 14px — teto do design system — preservando a escala relativa sm/md/lg/xl do shadcn.
- **Convenções de componente** (`0005`): shadcn/ui estilo `new-york`; `cn()` em `lib/utils.ts`; variantes de componentes do site (ex: `ServiceCard` aéreo/rodoviário/fluvial) via `class-variance-authority`; arquivos kebab-case, exports PascalCase.
- **Formulário de orçamento** (`0006`, submit via `0015`): schema Zod único (`lib/schemas/orcamento.ts`) usado no client (via `zodResolver` do React Hook Form) e revalidado dentro do Route Handler `app/api/orcamento/route.ts`. React Hook Form no controle do submit, chamando `fetch("/api/orcamento")` — não via `<form action>` nativo. Trade-off aceito: sem progressive enhancement (formulário depende de JS).
- **Route Handlers como BFF** (`0015`): substituem Server Actions — pedido do cliente, motivado por ops mais simples no self-hosting da Hostinger (sem chave de encriptação de Server Actions pra gerenciar) e por uma superfície de API explícita/testável. `lib/security.ts` reimplementa manualmente a checagem `Origin` vs `Host` que Server Actions dão de graça, pra não perder essa proteção na troca.
- **Rate limiting e self-hosting** (`0007`): rate limit em memória (sliding window por IP), adequado porque o deploy na Hostinger roda como processo Node único (não serverless/multi-instância). Sem Server Actions (ADR 0015), não há chave de encriptação a gerenciar.
- **Headers de segurança e CSP** (`0008`): CSP estática via `next.config.ts` (sem nonce), preservando geração estática nas páginas institucionais; inclui HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restritiva, `frame-ancestors 'none'`.
- **LGPD** (`0009`): sem persistência própria dos dados do formulário — fluxo é form → Route Handler → e-mail via Resend, sem banco de dados. Consentimento obrigatório no schema (`z.literal(true)`), link para `/privacidade` (rota nova), que declara a transferência internacional de dados ao Resend (EUA). **Texto jurídico final não incluído nesta spec** — precisa de revisão de quem responde legalmente pelo cliente.
- **Breakpoints** (`0014`, substitui `0010`): valores customizados do design system — `sm:640px / md:720px / lg:920px / xl:1200px` (sem `2xl`), via `--breakpoint-*` no `@theme` do Tailwind v4.
- **Radius** (`0014`, emenda `0004`): três valores explícitos — `sm:7px` (inputs, badges pequenos), `md:10px` (cards, botões), `lg:14px` (cards grandes, painéis) — não uma escala `calc()` derivada de uma única variável base.
- **SEO** (`0012`): `export const metadata` estático por página (sem `generateMetadata`, já que não há dado dinâmico); `app/sitemap.ts` e `app/robots.ts` com as rotas fixas; JSON-LD `LocalBusiness` no layout raiz (`app/layout.tsx`), sanitizado contra XSS (`dangerouslySetInnerHTML` com replace de `<`).
- **Formulário de Contato** (`0013`): segundo formulário (nome, e-mail, telefone opcional, assunto opcional, mensagem), distinto do orçamento. Schema (`lib/schemas/contato.ts`) e Route Handler (`app/api/contato/route.ts`) próprios — não um schema único parametrizado, os campos divergem demais. Reusa `sendNotificationEmail` (`lib/data/email.ts`), a mesma função DAL que o orçamento usa para chamar o Resend — sem duplicar client/tratamento de erro/dry-run. Rate limit (`lib/rate-limit.ts`, ADR 0007) com contador separado por formulário (`orcamento:<ip>` vs `contato:<ip>`), para que abuso em um não consuma a cota do outro.
- **Dados reais de contato** (substituem qualquer placeholder usado em mockups/rascunhos anteriores, aplicados em todo o site — footer, página Contato, JSON-LD `LocalBusiness`):
  - Telefone/WhatsApp: (11) 94706-4090
  - E-mail: contato@dnaircargo.com.br
  - Endereço: São Paulo, SP - Brasil (sem logradouro/número — ver nota em Further Notes)
  - Horário de atendimento: Segunda a sexta, 8h às 18h
  - Botão de WhatsApp na página Contato: link direto `https://wa.me/5511947064090` (sem necessidade de componente ou lógica além de um link estilizado em destaque — não é uma decisão de arquitetura, é conteúdo).

## Testing Decisions

Detalhe completo em `docs/adr/0011-testing-strategy.md`. Princípios:

- Testar comportamento externo (o que o usuário/consumidor observa), não detalhes de implementação — ex: "o card renderiza o ícone e a cor da variante aérea", não "o componente chama `cva` com tais argumentos".
- **Seam principal (o mais alto possível, único onde der)**: teste E2E via Playwright na UI real do formulário de orçamento — preenche, valida, envia, verifica estado de sucesso/erro — exercitando React Hook Form, schema Zod, o Route Handler, rate limit e checkbox de consentimento juntos, em vez de simular cada camada isoladamente.
- Resend em **modo dry-run** durante testes (`E2E_TEST_MODE=true` no DAL `lib/data/email.ts`, loga o payload em vez de chamar a API real) — nenhum teste dispara e-mail real. **Checar explicitamente que essa flag está desligada em produção** faz parte do checklist de deploy.
- Testes unitários (Vitest + React Testing Library) cobrem o que o seam E2E não alcança em granularidade: variantes cva do `ServiceCard`, casos de borda do schema Zod isolado (sem UI), e o hook `useScrollReveal`/`<Reveal>` (com `IntersectionObserver` mockado, ausente em jsdom).
- Arquivos de teste colocados ao lado do componente (`service-card.tsx` + `service-card.test.tsx`), consistente com a convenção de colocation da ADR 0001.
- Sem prior art no repo — projeto começou como scaffold puro do `create-next-app`, sem testes existentes.

## Out of Scope

- Dark mode (tema é único, fixo — ADR 0003).
- CMS ou qualquer conteúdo dinâmico/gerado por usuário (todas as rotas são fixas — ADR 0012).
- Persistência própria dos dados do formulário (banco de dados, CRM, planilha) — ADR 0009. Se isso mudar no futuro, a spec de LGPD precisa ser revisitada.
- Rate limiting distribuído (Redis/Upstash) — só necessário se o deploy migrar para múltiplas instâncias (ADR 0007).
- CSP com nonce ou SRI (Subresource Integrity) — considerados e descartados em favor de CSP estática (ADR 0008); só relevantes se o site ganhar superfície de UGC.
- Progressive enhancement do formulário de orçamento sem JavaScript (ADR 0006).
- Redação final do texto jurídico da Política de Privacidade, dos Termos de Uso e do texto do checkbox de consentimento — a spec define a estrutura técnica, não o conteúdo legal (ADR 0009, ADR 0016).
- Breakpoints customizados — usa defaults do Tailwind v4 (ADR 0010), a menos que QA visual contra o site atual revele necessidade.
- Internacionalização/multi-idioma (não mencionado nos requisitos).
- Setup de CI/CD e pipeline de deploy na Hostinger (fora do escopo desta spec, que cobre a aplicação em si).
- Valores concretos dos tokens de design (paleta de cor exata, escala tipográfica Manrope+Inter, espaçamento) — assumidos como já definidos no design system do cliente, não decididos nesta spec.

## Further Notes

- **Conteúdo real extraído do site atual** (ADR 0016): Home, Sobre, Serviços e Contato usam o texto real do site em produção, não placeholder. `/orcamento`, `/privacidade` e `/termos` ainda não passaram por essa extração (as duas últimas provavelmente nunca vão ter HTML de origem, já que são conteúdo jurídico pendente — ver nota abaixo).
- **Termos de Uso (`/termos`)**: rota existe (linkada no footer do site atual), mas sem conteúdo real disponível — página publicada como placeholder estrutural, mesma situação da Política de Privacidade.
- **Endereço pendente de confirmação com o cliente**: os dados reais recebidos trazem apenas "São Paulo, SP - Brasil", sem logradouro/número. Confirmar com a Dna Air Cargo se o endereço deve ficar só em nível de cidade/estado (ex: por não terem um endereço físico de atendimento ao público) ou se um endereço completo deve ser detalhado — isso afeta tanto o texto da página Contato quanto o campo `address` do JSON-LD `LocalBusiness` (que aceita endereço parcial, mas um endereço completo tende a ajudar mais o SEO local).
- Esta spec resulta de uma sessão de grilling (`/grill-with-docs`) registrada como 12 ADRs em `docs/adr/`. Qualquer decisão aqui resumida deve ser conferida contra a ADR correspondente em caso de dúvida — a ADR é a fonte mais detalhada.
- O rastreador de issues deste repo não está configurado (sem `git remote`, `/setup-matt-pocock-skills` não concluído) — esta spec foi publicada como arquivo local em vez de issue, sem label `ready-for-agent` aplicada. Recomenda-se rodar `/setup-matt-pocock-skills` (opção markdown local) antes do próximo ciclo de planejamento, para que `to-issues`/`triage` funcionem sem essa fricção.
- A ADR 0009 (LGPD) e a implementação da Política de Privacidade não devem ser finalizadas em produção sem revisão de alguém que responda legalmente pelo cliente.
