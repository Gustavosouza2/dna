import { z } from "zod"

/**
 * Single schema, shared between the client (React Hook Form's
 * zodResolver) and the server (revalidated inside the Route Handler) —
 * ADR 0006/0015. Client-side validation is just UX; the one that
 * really matters runs on the server.
 */
export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  email: z.email("E-mail inválido"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
  origin: z.string().trim().min(2, "Informe a cidade/UF de origem"),
  destination: z.string().trim().min(2, "Informe a cidade/UF de destino"),
  transportType: z.enum(["air", "road", "river"], {
    error: "Selecione o tipo de transporte",
  }),
  cargoType: z.string().trim().min(2, "Descreva o tipo de carga"),
  weightVolume: z.string().trim().min(1, "Informe peso e/ou volume aproximado"),
  consent: z.literal(true, {
    error: "É necessário aceitar a política de privacidade para continuar",
  }),
})

export type QuoteInput = z.infer<typeof quoteSchema>
