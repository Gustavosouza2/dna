import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ClockIcon,
  MessageCircleIcon,
  ShieldIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { ServiceCard } from "@/components/sections/service-card";
import { SERVICES } from "@/content/services";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Home",
};

// Content (hero, features, CTA) extracted from the current site's
// rendered HTML for fidelity — not invented text in this recodification.
const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Segurança garantida",
    description: "Todas as cargas são seguradas e monitoradas 24/7 durante todo o trajeto.",
  },
  {
    icon: ClockIcon,
    title: "Pontualidade",
    description:
      "Atendemos a necessidade de cada cliente garantindo a pontualidade, qualidade na informação e nosso diferencial!",
  },
  {
    icon: TrendingUpIcon,
    title: "Crescimento contínuo",
    description:
      "DNA tem experiência no crescimento contínuo da alta direção com amplo conhecimento de 26 anos nos serviços aéreo e rodoviário em todo território nacional, com essa experiência garantimos o crescimento da DNA e dos nossos clientes!",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-operacao.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy/90 via-navy/70 to-navy/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-[clamp(32px,4.4vw,50px)]">
                Conectamos o Brasil com eficiência e segurança
              </h1>
            </Reveal>
            <Reveal delayMs={100}>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-200 md:text-2xl">
                Soluções completas em logística e transporte de cargas. Aéreo,
                rodoviário e fluvial com rastreamento em tempo real.
              </p>
            </Reveal>
            <Reveal delayMs={200}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" nativeButton={false} render={<Link href="/quote" />}>
                  Solicitar orçamento
                </Button>
                <Button
                  size="lg"
                  variant="whatsapp"
                  nativeButton={false}
                  render={
                    <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <MessageCircleIcon className="size-5" />
                  Falar no WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-bg py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="sr-only">Nossos diferenciais</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delayMs={i * 100}>
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-lg bg-blue-50">
                    <feature.icon className="size-8 text-blue-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {feature.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
                Nossos serviços
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Escolha a modalidade ideal para sua carga. Oferecemos soluções
                personalizadas para cada necessidade.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.slug} delayMs={i * 100}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  href={`/services/${service.slug}`}
                  variant={service.slug}
                />
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={300}>
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href="/services" />}
              >
                Ver todos os serviços
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Pronto para enviar sua carga?"
        description="Solicite um orçamento sem compromisso e descubra como podemos ajudar sua empresa."
      >
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-white/90"
          nativeButton={false}
          render={<Link href="/quote" />}
        >
          Solicitar orçamento gratuito
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white bg-transparent text-white hover:bg-white/10"
          nativeButton={false}
          render={<Link href="/contact" />}
        >
          Falar com especialista
        </Button>
      </CtaBand>
    </>
  );
}
