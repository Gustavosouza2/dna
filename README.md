# Dna Air Cargo — site institucional

Next.js 16 (App Router, Turbopack) + React 19 + Tailwind 4. Site
institucional com formulários de orçamento e contato que enviam e-mail
via [Resend](https://resend.com).

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # ajuste os valores (ver abaixo)
npm run dev                  # http://localhost:3000
```

Em `.env.local`, para desenvolvimento:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
E2E_TEST_MODE=true          # dry-run: loga o e-mail em vez de enviar
```

## Verificação

```bash
npx tsc --noEmit     # tipos
npm run lint         # eslint
npm test             # unitários (vitest)
npm run test:e2e     # e2e (playwright)
npm run build        # build de produção
```

## Variáveis de ambiente

Todas descritas em [`.env.example`](.env.example). Resumo:

| Variável | Quando é lida | Produção |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **build** | `https://www.dnaircargo.com.br` (host final) |
| `RESEND_API_KEY` | runtime | chave de produção, própria |
| `RESEND_SENDING_DOMAIN` | runtime | domínio verificado no Resend |
| `RESEND_TO_EMAIL` | runtime | caixa que recebe os leads |
| `E2E_TEST_MODE` | runtime | **não definir** |

`NEXT_PUBLIC_SITE_URL` alimenta `metadataBase`, `sitemap.xml` e
`robots.txt`, que são gerados estaticamente — precisa estar definida
**antes** do `npm run build`, e mudá-la exige um novo build.

## Deploy na Hostinger

O projeto roda como processo Node persistente (`next start`), não como
site estático — `/api/quote` e `/api/contact` são dinâmicos e o rate
limit é em memória, assumindo **uma única instância** (ADR 0007).

1. **Domínio**: aponte o domínio para a hospedagem e escolha um host
   canônico (com `www` ou sem). Configure redirect 301 do outro para o
   canônico no painel da Hostinger, e use o canônico em
   `NEXT_PUBLIC_SITE_URL`.
2. **SSL**: ative o certificado (Let's Encrypt) e o "force HTTPS". O
   app já envia `Strict-Transport-Security` com `preload`.
3. **E-mail**: no Resend, adicione e verifique o domínio (registros
   SPF/DKIM no DNS da Hostinger). Só depois de verificado o remetente
   `site@dnaircargo.com.br` funciona; sem isso o envio fica em sandbox
   e só entrega para o dono da conta Resend.
4. **Variáveis**: defina as da tabela acima no ambiente do servidor
   (painel Node.js da Hostinger ou `ecosystem.config.js` do PM2).
5. **Build e start** no servidor:

   ```bash
   npm ci
   npm run build
   npm run start        # ou: pm2 start npm --name dna -- run start
   ```

   `npm run start` escuta em `PORT` (padrão 3000) — o proxy da
   Hostinger encaminha 80/443 para essa porta.

6. **Após o primeiro deploy**, verifique nesta ordem:
   - `https://<domínio>/robots.txt` e `/sitemap.xml` apontando para o
     domínio real (se aparecer `localhost`, o build rodou sem
     `NEXT_PUBLIC_SITE_URL` — rebuilde);
   - envio real dos dois formulários, confirmando a chegada do e-mail;
   - se o formulário responder **403 "Origem não permitida"**, o proxy
     da Hostinger está reescrevendo o `Host` para o interno. A
     verificação anti-CSRF (`lib/security.ts`) compara `Origin` com
     `x-forwarded-host`/`Host` — configure o proxy para repassar
     `X-Forwarded-Host` com o domínio público.

## Documentação

- `docs/adr/` — decisões de arquitetura (ADRs).
- `docs/design-system.md` — tokens e componentes.
- `docs/specs/` — especificação do site.
