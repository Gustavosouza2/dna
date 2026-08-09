import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getServiceBySlug } from "@/content/services";

export const metadata: Metadata = {
  title: "Transporte Rodoviário",
};

export default function RoadTransportPage() {
  const service = getServiceBySlug("road")!;
  const Icon = service.icon;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 md:px-8">
      <Link
        href="/services"
        className="mb-6 inline-block text-sm text-slate-600 transition-colors hover:text-blue-600"
      >
        ← Todos os serviços
      </Link>
      <Reveal>
        <Icon className="size-10 text-blue-600" />
        <h1 className="mt-4 font-display text-[34px] font-bold text-navy">
          {service.title}
        </h1>
        <p className="mt-3 text-[17px] text-slate-600">{service.description}</p>
      </Reveal>

      <Reveal delayMs={100}>
        <ul className="mt-8 flex flex-col gap-3">
          {service.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-slate-600">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-blue-600" />
              {benefit}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delayMs={200}>
        <Button size="lg" className="mt-10" nativeButton={false} render={<Link href="/quote" />}>
          Solicitar orçamento
        </Button>
      </Reveal>
    </section>
  );
}
