import type { Metadata } from "next";

import { CONTACT, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 md:px-8">
      <h1 className="font-display text-[34px] font-bold text-navy">
        Termos de Uso
      </h1>
      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-slate-600">
        <p className="rounded-lg border border-dashed border-line bg-bg p-4 text-xs">
          Conteúdo pendente — esta página existe no site atual, mas o texto
          real ainda não foi levantado. Precisa de conteúdo/revisão de
          quem responde legalmente pela {SITE_NAME} antes de publicar.
        </p>

        <p>
          Dúvidas sobre os termos de uso deste site podem ser enviadas para{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-blue-600 underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
