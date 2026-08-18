import {
  ClockIcon,
  MapPinIcon,
  PackageIcon,
  PlaneIcon,
  ShieldIcon,
  ShipIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"

export type ServiceSlug = "air" | "road" | "river"

export interface ServiceHighlight {
  icon: LucideIcon
  label: string
}

export interface ServiceContent {
  highlights: ServiceHighlight[]
  longDescription: string
  description: string
  benefits: string[]
  slug: ServiceSlug
  icon: LucideIcon
  title: string
  image: string
}

// Content extracted from the current site's rendered HTML (fidelity —
// ADR 0016), not invented text. Source: DOM of Home and /services in
// production.
export const SERVICES: ServiceContent[] = [
  {
    slug: "air",
    icon: PlaneIcon,
    title: "Transporte aéreo",
    description:
      "Entregas rápidas e seguras para todo o Brasil com rastreamento em tempo real.",
    longDescription:
      "Entregas rápidas e seguras para todo o Brasil. Nossa rede de parceiros garante conexões eficientes com os principais aeroportos do país.",
    image: "/images/servico-aereo.jpg",
    highlights: [
      { icon: ClockIcon, label: "Entregas em até 24h" },
      { icon: ShieldIcon, label: "Seguro total" },
      { icon: MapPinIcon, label: "Cobertura nacional" },
    ],
    benefits: [
      "Entregas expressas em 24-48 horas",
      "Rastreamento em tempo real",
      "Seguro total incluído",
      "Documentação aduaneira completa",
      "Cargas refrigeradas disponíveis",
      "Atendimento 24/7",
    ],
  },
  {
    slug: "road",
    icon: TruckIcon,
    title: "Transporte rodoviário",
    description:
      "Equipe especializada e parceiros transportadores qualificados para cargas de todos os portes e distâncias.",
    longDescription:
      "Equipe especializada e parceiros transportadores qualificados para cargas de todos os portes. Oferecemos flexibilidade de rotas e horários para atender suas necessidades.",
    image: "/images/servico-rodoviario.jpg",
    highlights: [
      { icon: PackageIcon, label: "Carga fracionada" },
      { icon: TruckIcon, label: "Equipe especializada" },
      { icon: ShieldIcon, label: "Rastreamento GPS" },
    ],
    benefits: [
      "Parceiros transportadores rastreados por GPS",
      "Cargas fracionadas ou completas",
      "Coleta e entrega porta a porta",
      "Flexibilidade de horários",
      "Motoristas treinados e certificados",
      "Parceiros avaliados e homologados",
    ],
  },
  {
    slug: "river",
    icon: ShipIcon,
    title: "Transporte fluvial",
    description:
      "Soluções econômicas para grandes volumes através das principais hidrovias brasileiras.",
    longDescription:
      "Soluções econômicas para grandes volumes através das principais hidrovias brasileiras. Ideal para cargas pesadas e volumosas com menor impacto ambiental.",
    image: "/images/servico-fluvial.jpg",
    highlights: [
      { icon: ShipIcon, label: "Grandes volumes" },
      { icon: PackageIcon, label: "Cargas pesadas" },
      { icon: MapPinIcon, label: "Hidrovias principais" },
    ],
    benefits: [
      "Custo-benefício para grandes volumes",
      "Rotas pela Amazônia e Pantanal",
      "Cargas especiais e pesadas",
      "Menor impacto ambiental",
      "Capacidade para containers",
      "Operação em portos estratégicos",
    ],
  },
]

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug)
}
