"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/forms/form-field"
import { contactSchema, type ContactInput } from "@/lib/schemas/contact"

/**
 * RHF drives the submit, calling the /api/contact Route Handler via
 * fetch (ADR 0015, replaces the Server Action from ADR 0013).
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      consent: undefined,
    },
  })

  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (data: ContactInput) => {
    setServerError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setSuccess(true)
        reset()
      } else {
        setServerError(result.error ?? "Não foi possível enviar sua mensagem.")
      }
    } catch {
      setServerError("Não foi possível enviar sua mensagem. Verifique sua conexão.")
    }
  }

  const pending = isSubmitting

  return (
    <div aria-live="polite">
      {success ? (
        <div
          role="status"
          className="rounded-lg border border-line bg-green-50 p-6 text-center"
        >
          <p className="font-display text-lg font-bold text-navy">
            Mensagem enviada com sucesso!
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Vamos responder o quanto antes.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
            Enviar outra mensagem
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nome completo" error={errors.name?.message}>
              <Input {...register("name")} placeholder="Seu nome" />
            </FormField>
            <FormField label="E-mail" error={errors.email?.message}>
              <Input {...register("email")} type="email" placeholder="seu@email.com" />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Telefone (opcional)" error={errors.phone?.message}>
              <Input {...register("phone")} placeholder="(00) 00000-0000" />
            </FormField>
            <FormField label="Assunto (opcional)" error={errors.subject?.message}>
              <Input {...register("subject")} placeholder="Sobre o que você quer falar?" />
            </FormField>
          </div>

          <FormField label="Mensagem" error={errors.message?.message}>
            <Textarea {...register("message")} rows={5} placeholder="Escreva sua mensagem" />
          </FormField>

          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <div className="flex items-start gap-2.5 pt-2">
                <Checkbox
                  id="consent-contact"
                  checked={field.value ?? false}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? "consent-contact-error" : undefined}
                />
                <Label htmlFor="consent-contact" className="text-sm font-normal text-slate-600">
                  Li e concordo com a{" "}
                  <Link href="/privacy" className="text-blue-600 underline">
                    Política de Privacidade
                  </Link>
                  .
                </Label>
              </div>
            )}
          />
          {errors.consent && (
            <p id="consent-contact-error" role="alert" className="text-sm text-destructive">
              {errors.consent.message}
            </p>
          )}

          {serverError && (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={pending} className="mt-2 self-start">
            {pending ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>
      )}
    </div>
  )
}
