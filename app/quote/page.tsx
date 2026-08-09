import type { Metadata } from "next";

import { QuoteForm } from "@/components/forms/quote-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Solicitar Orçamento",
};

export default function QuotePage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 md:px-8">
      <Reveal>
        <h1 className="font-display text-[34px] font-bold text-navy">
          Solicitar orçamento
        </h1>
        <p className="mt-3 text-[17px] text-slate-600">
          Preencha os dados abaixo e nossa equipe entra em contato com uma
          cotação personalizada.
        </p>
      </Reveal>

      <Reveal delayMs={100}>
        <div className="mt-10 rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
          <QuoteForm />
        </div>
      </Reveal>
    </section>
  );
}
