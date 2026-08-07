# 0006 — Formulário de orçamento: React Hook Form no controle, Server Action chamada como função

## Status

Aceito — 2026-08-06

## Contexto

Stack decidida: React Hook Form + Zod para o formulário de orçamento, Server Actions do Next.js + Resend para envio. Os dois modelos de submit (RHF `handleSubmit` vs `<form action={serverAction}>` + `useActionState`) competem pelo controle do envio. O Next recomenda o segundo por dar progressive enhancement de graça, mas isso não é compatível com o controle fino que RHF precisa ter sobre validação client-side, field-level errors e possíveis máscaras de campo (telefone, etc.).

## Decisão

- Schema único `lib/schemas/orcamento.ts` (Zod), reusado em dois pontos:
  - Client: `zodResolver` do RHF, para feedback instantâneo por campo.
  - Server: revalidado dentro da Server Action, que é o único lugar que efetivamente decide se os dados são aceitos — conforme o guia de Data Security do Next.js (nunca confiar em `FormData` só porque passou na validação client-side).
- RHF no controle do submit: `handleSubmit(async (data) => { await enviarOrcamento(data) })`, chamando a Server Action `lib/actions/orcamento.ts` como uma função assíncrona comum (não via `<form action={...}>` nativo), disparada dentro de `startTransition` para estado de pending.
- Trade-off aceito: o formulário **não funciona sem JavaScript** (sem progressive enhancement nativo). Justificativa: é um formulário de captação de lead que já depende de JS para a UX pretendida (validação em tempo real, seletores de origem/destino/tipo de carga); não é um fluxo crítico tipo checkout que precise sobreviver a falha de JS.

## Consequências

- A Server Action (`lib/actions/orcamento.ts`) permanece um endpoint POST alcançável diretamente — precisa validar e (quando decidido) aplicar rate limit nela mesma, não só confiar na validação client-side do RHF.
- Estado de pending/erro é gerenciado pelo próprio RHF (`formState.isSubmitting`, erros por campo), não por `useActionState`.
- Se no futuro for necessário progressive enhancement (ex: fallback para JS desabilitado), esta ADR precisa ser revisitada — provavelmente migrando para `<form action>` + `useActionState` com RHF só para realce client-side.
