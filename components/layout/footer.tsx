import Link from "next/link"
import { MailIcon, MapPinIcon, PhoneIcon, PlaneIcon } from "lucide-react"

import { CONTACT, FOOTER_NAV_ITEMS, SITE_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3 md:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <PlaneIcon className="size-6 text-blue-600" />
            <span>{SITE_NAME}</span>
          </div>
          <p className="text-sm leading-relaxed text-blue-100/80">
            Soluções completas em logística e transporte de cargas.
            Conectando o Brasil com eficiência e segurança.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold text-white">Links rápidos</p>
          <nav className="flex flex-col gap-2">
            {FOOTER_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-blue-100/80 transition-colors hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold text-white">Contato</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 size-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium">WhatsApp</p>
                <a
                  href={CONTACT.whatsappUrl}
                  className="text-sm text-blue-100/80 transition-colors hover:text-blue-600"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MailIcon className="mt-0.5 size-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium">E-mail</p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-blue-100/80 transition-colors hover:text-blue-600"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Localização</p>
                <p className="text-sm text-blue-100/80">
                  {CONTACT.addressLocality}, {CONTACT.addressRegion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 border-t border-white/10 px-6 py-8 md:flex-row md:justify-between md:px-8">
        <p className="text-sm text-blue-100/60">
          © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
        </p>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="text-sm text-blue-100/60 transition-colors hover:text-blue-600"
          >
            Política de privacidade
          </Link>
          <Link
            href="/terms"
            className="text-sm text-blue-100/60 transition-colors hover:text-blue-600"
          >
            Termos de uso
          </Link>
        </div>
      </div>
    </footer>
  )
}
