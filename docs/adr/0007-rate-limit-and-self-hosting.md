# 0007 — Rate limiting em memória e chave de encriptação fixa para self-hosting

## Status

Aceito — 2026-08-06

## Contexto

Deploy definido: Hostinger (hospedagem própria, não Vercel/serverless-edge), rodando como processo Node persistente (`next start`), presumivelmente instância única para um site institucional deste porte. Isso muda o cálculo de rate limiting em relação a um deploy serverless: um contador em memória sobrevive entre requisições na mesma instância.

Adicionalmente, o guia de Data Security do Next.js 16 aponta que Server Actions usam IDs de ação criptografados, recalculados a cada build/reinício se a chave de encriptação não for fixada — o que pode invalidar Actions em voo em deploys self-hosted com múltiplas instâncias ou reinícios frequentes.

## Decisão

- `lib/rate-limit.ts`: rate limit em memória (`Map` com sliding window), sem dependência externa (Redis/Upstash). Chave = IP do requisitante, extraído via `headers()` dentro da Server Action (considerando `x-forwarded-for` do proxy da Hostinger). Limite inicial: 3 envios / 10 min por IP no formulário de orçamento — ajustável.
- Definir `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` como variável de ambiente fixa no servidor Hostinger, gerada uma vez com `openssl rand -base64 32` e mantida estável entre deploys/reinícios.

## Consequências

- Rate limit funciona corretamente apenas com **uma única instância** do processo Node atrás do proxy da Hostinger. Se o site escalar para múltiplas instâncias/load balancer, esta ADR precisa ser revisitada — migrar para um store compartilhado (Redis ou similar).
- Rate limit é perdido a cada reinício do processo (contador em memória zera) — aceitável para o perfil de abuso esperado (formulário de orçamento institucional, não um endpoint de alto valor para bots).
- A chave de encriptação fixa evita erros de "Failed to find Server Action" após deploys, e mantém consistência entre reinícios do processo Node.
