import type { Metadata } from "next";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contato",
};

const CONTACT_INFO = [
  {
    icon: PhoneIcon,
    label: "Telefone",
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneE164}`,
  },
  {
    icon: MailIcon,
    label: "E-mail",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: MapPinIcon,
    label: "Endereço",
    value: `${CONTACT.addressLocality}, ${CONTACT.addressRegion} - Brasil`,
  },
  {
    icon: ClockIcon,
    label: "Horário",
    value: CONTACT.hours,
  },
];

export default function ContactPage() {
  return (
    <section className="bg-linear-to-br from-blue-50 to-bg py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-navy md:text-5xl">
              Entre em contato
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-slate-600">
              Estamos prontos para atender suas necessidades. Escolha a
              melhor forma de falar conosco.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="rounded-lg border border-line bg-white p-6 shadow-card md:p-8">
              <h2 className="font-display text-2xl font-bold text-navy">
                Envie uma mensagem
              </h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={100} className="flex flex-col gap-6">
            <div className="rounded-lg border border-line bg-white p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-navy">
                Informações de contato
              </h3>
              <div className="mt-6 flex flex-col gap-6">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <item.icon className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm text-slate-600 transition-colors hover:text-blue-600"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-600">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-green-600/20 bg-green-50 p-6">
              <h3 className="font-display font-bold text-navy">
                Atendimento rápido
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Precisa de uma resposta imediata? Fale conosco pelo WhatsApp.
              </p>
              <Button
                variant="whatsapp"
                className="mt-4 w-full"
                nativeButton={false}
                render={
                  <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" />
                }
              >
                <MessageCircleIcon className="size-5" />
                Falar no WhatsApp
              </Button>
            </div>

            <div className="rounded-lg border border-line bg-white p-6 shadow-card">
              <h3 className="font-display font-bold text-navy">Localização</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Estamos localizados em São Paulo, atendendo todo o Brasil e
                exterior.
              </p>
              <div className="mt-4 flex h-48 w-full items-center justify-center rounded-lg bg-bg">
                <MapPinIcon className="size-8 text-slate-400" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
