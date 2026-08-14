import type { Metadata } from "next";
import Image from "next/image";
import {
  AwardIcon,
  HeartIcon,
  MessageCircleIcon,
  ShieldIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { CONTACT, STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre",
};

// Content extracted from the current site's rendered HTML (fidelity —
// ADR 0016), not invented text.
const VALUES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldIcon,
    title: "Segurança",
    description:
      "Todas as cargas são seguradas e monitoradas durante todo o trajeto, garantindo tranquilidade para nossos clientes.",
  },
  {
    icon: HeartIcon,
    title: "Compromisso",
    description:
      "Tratamos cada carga como se fosse nossa, com dedicação e responsabilidade em todas as etapas.",
  },
  {
    icon: TrendingUpIcon,
    title: "Eficiência",
    description:
      "Processos otimizados e tecnologia de ponta para garantir entregas rápidas e custos competitivos.",
  },
  {
    icon: UsersIcon,
    title: "Parceria",
    description:
      "Construímos relacionamentos duradouros baseados em confiança, transparência e resultados.",
  },
];

const DIFFERENTIALS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: AwardIcon,
    title: "Experiência comprovada",
    description:
      "Mais de 26 anos de experiência da alta direção nos serviços aéreo e rodoviário, atuando em todo o território nacional.",
  },
  {
    icon: TargetIcon,
    title: "Soluções personalizadas",
    description:
      "Cada cliente tem necessidades únicas. Desenvolvemos estratégias específicas para cada operação.",
  },
  {
    icon: ShieldIcon,
    title: "Segurança total",
    description:
      "Seguro completo, rastreamento em tempo real e equipe treinada para garantir a integridade da carga.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-bg py-20">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-8">
          <Reveal>
            <h1 className="font-display text-4xl font-bold text-navy md:text-5xl">
              Sobre a Dna Air Cargo
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-slate-600">
              Conectamos o Brasil através de soluções inteligentes em
              logística e transporte de cargas.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-white">
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-8 px-6 md:px-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delayMs={i * 100}>
              <div className="text-center">
                <p className="font-display text-4xl font-bold md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm opacity-90 md:text-base">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="mb-6 flex size-14 items-center justify-center rounded-md bg-blue-50">
              <TargetIcon className="size-7 text-blue-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
              Nossa missão
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Facilitar o transporte de cargas no Brasil através de soluções
              logísticas eficientes, seguras e acessíveis. Queremos ser a
              ponte que conecta empresas aos seus clientes, garantindo que
              cada entrega seja feita com excelência.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Acreditamos que logística de qualidade não precisa ser
              complicada. Por isso, investimos em tecnologia, treinamento e
              processos que tornam o transporte de cargas mais simples e
              confiável para nossos clientes.
            </p>
          </Reveal>

          <Reveal delayMs={150}>
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-card-hover">
              <Image
                src="/images/estrutura-sobre.jpg"
                alt="Centro de distribuição da Dna Air Cargo, com docas de carregamento, paletes e estruturas porta-paletes"
                fill
                sizes="(min-width: 720px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
                Nossos valores
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Princípios que guiam cada decisão e ação da nossa empresa.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delayMs={i * 100}>
                <div className="h-full rounded-lg border border-line bg-white p-6 shadow-card">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-blue-50">
                    <value.icon className="size-6 text-blue-600" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {value.description}
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
                Por que escolher a Dna Air Cargo?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Diferenciais que fazem da Dna Air Cargo a escolha certa para
                sua logística.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIALS.map((item, i) => (
              <Reveal key={item.title} delayMs={i * 100}>
                <div className="h-full rounded-lg border border-line bg-white p-8 shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-md bg-blue-50">
                    <item.icon className="size-7 text-blue-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Vamos trabalhar juntos?"
        description="Entre em contato e descubra como podemos ajudar sua empresa a crescer."
      >
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-white/90"
          nativeButton={false}
          render={
            <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" />
          }
        >
          <MessageCircleIcon className="size-5" />
          Falar no WhatsApp
        </Button>
      </CtaBand>
    </>
  );
}
