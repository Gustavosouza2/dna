import type { Metadata } from "next";

import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 md:px-8">
      <h1 className="font-display text-[34px] font-bold text-navy">
        Política de Privacidade
      </h1>

      {/*
        ADR 0009: technical structure of the points required by LGPD.
        Text is still a draft — needs review from someone legally
        responsible for the company before publishing to production.
      */}
      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-slate-600">
        <p className="rounded-lg border border-dashed border-line bg-bg p-4 text-xs">
          Rascunho — este texto ainda precisa de revisão jurídica antes de ir
          para produção.
        </p>

        <div>
          <h2 className="font-display text-lg font-bold text-navy">
            Quais dados coletamos
          </h2>
          <p className="mt-2">
            Ao preencher os formulários de orçamento ou contato deste site,
            coletamos: nome, e-mail, telefone, e, no caso do formulário de
            orçamento, origem, destino, tipo de transporte, tipo de carga e
            peso/volume aproximado.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy">
            Finalidade
          </h2>
          <p className="mt-2">
            Os dados são usados exclusivamente para responder à sua
            solicitação de orçamento ou contato.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy">
            Base legal
          </h2>
          <p className="mt-2">
            Tratamos seus dados com base no seu consentimento e na execução
            de procedimento preliminar a um eventual contrato de prestação de
            serviço (art. 7º, V, da Lei Geral de Proteção de Dados).
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy">
            Armazenamento e transferência internacional
          </h2>
          <p className="mt-2">
            Não armazenamos os dados enviados pelos formulários em banco de
            dados próprio — eles são encaminhados por e-mail para a nossa
            equipe através do serviço Resend, empresa sediada nos Estados
            Unidos. Isso configura uma transferência internacional de dados
            nos termos do art. 33 da LGPD.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy">
            Seus direitos
          </h2>
          <p className="mt-2">
            Você pode solicitar acesso, correção, exclusão dos seus dados ou
            revogar seu consentimento a qualquer momento, entrando em contato
            pelo canal abaixo.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy">
            Contato
          </h2>
          <p className="mt-2">
            Dúvidas sobre esta política ou sobre o tratamento dos seus dados
            podem ser enviadas para{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-blue-600 underline">
              {CONTACT.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
