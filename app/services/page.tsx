import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { SERVICES, type ServiceContent } from "@/content/services";

export const metadata: Metadata = {
  title: "Serviços",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-bg py-20">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-8">
          <Reveal>
            <h1 className="font-display text-4xl font-bold text-navy md:text-5xl">
              Soluções completas em transporte de cargas
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-slate-600">
              Escolha a modalidade ideal para sua necessidade. Oferecemos
              transporte aéreo, rodoviário e fluvial com a mesma qualidade e
              segurança.
            </p>
          </Reveal>
        </div>
      </section>

      {SERVICES.map((service, i) => (
        <ServiceSection
          key={service.slug}
          service={service}
          imageOnRight={i % 2 === 0}
          onMuted={i === 1}
        />
      ))}

      <CtaBand
        title="Não sabe qual serviço escolher?"
        description="Nossa equipe está pronta para ajudar você a encontrar a melhor solução para sua carga."
      >
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-white/90"
          nativeButton={false}
          render={<Link href="/contact" />}
        >
          Falar com especialista
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white bg-transparent text-white hover:bg-white/10"
          nativeButton={false}
          render={<Link href="/quote" />}
        >
          Solicitar orçamento
        </Button>
      </CtaBand>
    </>
  );
}

function ServiceSection({
  service,
  imageOnRight,
  onMuted,
}: {
  service: ServiceContent;
  imageOnRight: boolean;
  onMuted: boolean;
}) {
  const Icon = service.icon;

  const text = (
    <Reveal>
      <div className="mb-6 flex size-14 items-center justify-center rounded-md bg-blue-50">
        <Icon className="size-7 text-blue-600" />
      </div>
      <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
        {service.title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        {service.longDescription}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {service.highlights.map((highlight) => (
          <div
            key={highlight.label}
            className="flex items-center gap-2 rounded-md border border-line bg-white p-3"
          >
            <highlight.icon className="size-5 shrink-0 text-blue-600" />
            <span className="text-sm font-medium text-navy">{highlight.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-navy">Benefícios:</h3>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {service.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <Button
        size="lg"
        className="mt-8"
        nativeButton={false}
        render={<Link href="/quote" />}
      >
        Solicitar orçamento
        <ArrowRightIcon className="size-5" />
      </Button>
    </Reveal>
  );

  const image = (
    <Reveal delayMs={150}>
      <div className="relative h-100 w-full overflow-hidden rounded-lg shadow-card-hover">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 720px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 `bg-linear-to-t from-navy/50 to-transparent" />
      </div>
    </Reveal>
  );

  return (
    <section className={onMuted ? "bg-bg py-24" : "py-24"}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-8">
        {imageOnRight ? (
          <>
            {text}
            {image}
          </>
        ) : (
          <>
            {image}
            {text}
          </>
        )}
      </div>
    </section>
  );
}
