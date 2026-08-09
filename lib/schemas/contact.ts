import { z } from "zod"

/**
 * The Contact form's own schema — doesn't reuse the quote form's, the
 * fields diverge too much (ADR 0013).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  email: z.email("E-mail inválido"),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Escreva uma mensagem um pouco mais detalhada"),
  consent: z.literal(true, {
    error: "É necessário aceitar a política de privacidade para continuar",
  }),
})

export type ContactInput = z.infer<typeof contactSchema>
