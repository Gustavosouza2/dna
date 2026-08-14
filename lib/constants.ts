export const SITE_NAME = "Dna Air Cargo"

export const CONTACT = {
  phoneDisplay: "(11) 94706-4090",
  phoneE164: "+5511947064090",
  whatsappUrl: "https://wa.me/5511947064090",
  email: "contactdna@gmail.com",
  // TODO: confirm with the client whether the address stays at
  // city/state level only or a full street address should be added
  // (also affects the JSON-LD LocalBusiness — see docs/specs).
  addressLocality: "São Paulo",
  addressRegion: "SP",
  addressCountry: "BR",
  hours: "Segunda a sexta, 8h às 18h",
} as const

// Order and items match the current site's header (fidelity).
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Serviços" },
  { href: "/quote", label: "Solicitar orçamento" },
  { href: "/contact", label: "Contato" },
  { href: "/about", label: "Sobre" },
] as const

// Footer "Links rápidos" has a different list than the header nav
// (no Contato) — matches the current site.
export const FOOTER_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Serviços" },
  { href: "/quote", label: "Solicitar orçamento" },
  { href: "/about", label: "Sobre nós" },
] as const

export const STATS = [
  { value: "26+", label: "Anos de experiência" },
  { value: "24/7", label: "Suporte disponível" },
] as const
