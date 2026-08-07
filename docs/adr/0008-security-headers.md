# 0008 — CSP estática (sem nonce) e headers de segurança via next.config.ts

## Status

Aceito — 2026-08-06

## Contexto

Next.js 16 oferece duas abordagens de CSP: nonce dinâmico via `proxy.ts` (novo nonce por request, mas exige renderização dinâmica em todas as páginas que o usam, incompatível com geração estática e cache de CDN) ou CSP estática configurada em `next.config.ts` (`headers()`), compatível com páginas estáticas mas usando `'unsafe-inline'` em vez de nonce para scripts/estilos.

Conforme a ADR 0002, só o formulário de orçamento precisa de renderização dinâmica; as demais páginas (Home, Serviços, Sobre, Contato) são conteúdo institucional estático onde SEO e LCP importam e não há renderização de conteúdo gerado por usuário.

## Decisão

- CSP estática definida em `next.config.ts` via `headers()`, sem nonce. `script-src`/`style-src` usam `'unsafe-inline'` (aceitando a redução de rigor de CSP contra XSS, mitigada pela ausência de superfícies de UGC renderizadas no site).
- Headers adicionais aplicados a todas as rotas via `next.config.ts`:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` restritiva (sem geolocation/camera/microphone/etc.)
  - `frame-ancestors 'none'` (dentro da própria CSP, equivalente a `X-Frame-Options: DENY`)

## Consequências

- Home, Serviços, Sobre e Contato permanecem estaticamente geradas e cacheáveis; só o formulário de orçamento (Server Action) roda dinâmico.
- CSP não bloqueia scripts/estilos inline (`'unsafe-inline'`) — proteção mais fraca contra XSS do que a versão com nonce, mas aceitável dado que não há conteúdo gerado por usuário exibido nas páginas.
- Se o site ganhar uma superfície de UGC no futuro (comentários, avaliações, etc.), esta ADR deve ser revisitada — considerar nonce via `proxy.ts` ou SRI experimental (hash-based, preserva geração estática, App Router only) como alternativas mais estritas.
