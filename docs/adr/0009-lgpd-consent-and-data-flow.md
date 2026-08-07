# 0009 — LGPD: sem persistência própria, consentimento obrigatório, transferência internacional declarada

## Status

Aceito — 2026-08-06

## Contexto

O formulário de orçamento coleta dados pessoais (nome, e-mail, telefone, origem, destino, tipo de transporte, tipo de carga, peso/volume). Confirmado com o cliente: **não há persistência própria** desses dados — o fluxo é form → Server Action → e-mail via Resend → fim. Resend é uma empresa sediada nos EUA, o que configura transferência internacional de dados sob a LGPD (art. 33).

## Decisão

- Dado flui do formulário para a Server Action, que valida (Zod) e envia via Resend. Nenhum banco de dados, planilha, CRM ou analytics próprio armazena os dados submetidos — a única cópia persistente é o e-mail recebido pela Dna Air Cargo (fora do controle da aplicação).
- Schema Zod do formulário inclui um campo de consentimento obrigatório (`z.literal(true)`, com mensagem de erro se desmarcado) — o formulário não pode ser enviado sem essa marcação.
- Checkbox de consentimento no formulário linka para uma nova rota estática `/politica-de-privacidade`.
- A página de política de privacidade cobre: dados coletados, finalidade, base legal (art. 7º, V — procedimento preliminar a contrato), destinatário e transferência internacional (Resend, EUA, declarada explicitamente conforme art. 33 da LGPD), direitos do titular e canal de contato para exercê-los.

## Consequências

- Escopo de conformidade simplificado: sem fluxo de retenção/exclusão em banco próprio para descrever ou implementar, porque não há banco.
- O **texto jurídico final** da política de privacidade e do texto do checkbox não é redigido definitivamente por esta sessão de arquitetura — precisa de revisão de alguém que responda legalmente pelo cliente antes de publicar. Este ADR define a estrutura técnica (rota, componente, validação), não o conteúdo jurídico.
- Se a Dna Air Cargo decidir no futuro persistir os leads (ex: CRM), esta ADR precisa ser revisitada — a política de privacidade e o texto de consentimento mudam de escopo.
