"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField } from "@/components/forms/form-field"
import { quoteSchema, type QuoteInput } from "@/lib/schemas/quote"

/**
 * RHF drives the submit, calling the /api/quote Route Handler via
 * fetch (ADR 0015, replaces the Server Action from ADR 0006) — not via
 * <form action>. No progressive enhancement, an accepted trade-off.
 */
export function QuoteForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    // onChange para o botão refletir a validade do formulário em tempo real.
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      origin: "",
      destination: "",
      cargoType: "",
      weightVolume: "",
      consent: undefined,
    },
  })

  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (data: QuoteInput) => {
    setServerError(null)
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setSuccess(true)
        reset()
      } else {
        setServerError(result.error ?? "Não foi possível enviar sua solicitação.")
      }
    } catch {
      setServerError("Não foi possível enviar sua solicitação. Verifique sua conexão.")
    }
  }

  const pending = isSubmitting
  // Envio só liberado com os campos obrigatórios preenchidos e o
  // aceite da Política de Privacidade marcado.
  const canSubmit = isValid

  return (
    <div aria-live="polite">
      {success ? (
        <div
          role="status"
          className="rounded-lg border border-line bg-green-50 p-6 text-center"
        >
          <p className="font-display text-lg font-bold text-navy">
            Solicitação enviada com sucesso!
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Nossa equipe vai analisar seu pedido e retornar em breve.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
            Enviar outra solicitação
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
            <FormField label="Telefone" error={errors.phone?.message}>
              <Input {...register("phone")} placeholder="(00) 00000-0000" />
            </FormField>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="transportType">Tipo de transporte</Label>
              <Controller
                control={control}
                name="transportType"
                render={({ field }) => (
                  <Select value={field.value ?? null} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="transportType"
                      className="w-full"
                      aria-invalid={errors.transportType ? true : undefined}
                      aria-describedby={
                        errors.transportType ? "transportType-error" : undefined
                      }
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">Aéreo</SelectItem>
                      <SelectItem value="road">Rodoviário</SelectItem>
                      <SelectItem value="river">Fluvial</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.transportType && (
                <p id="transportType-error" role="alert" className="text-xs text-destructive">
                  {errors.transportType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Origem" error={errors.origin?.message}>
              <Input {...register("origin")} placeholder="Cidade/UF de origem" />
            </FormField>
            <FormField label="Destino" error={errors.destination?.message}>
              <Input {...register("destination")} placeholder="Cidade/UF de destino" />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Tipo de carga" error={errors.cargoType?.message}>
              <Input {...register("cargoType")} placeholder="Ex: eletrônicos, perecíveis..." />
            </FormField>
            <FormField label="Peso / volume" error={errors.weightVolume?.message}>
              <Input {...register("weightVolume")} placeholder="Ex: 500kg / 2m³" />
            </FormField>
          </div>

          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <div className="flex items-start gap-2.5 pt-2">
                <Checkbox
                  id="consent"
                  checked={field.value ?? false}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                />
                <Label htmlFor="consent" className="text-sm font-normal text-slate-600">
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
            <p id="consent-error" role="alert" className="text-sm text-destructive">
              {errors.consent.message}
            </p>
          )}

          {serverError && (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending || !canSubmit}
            className="mt-2 self-start"
          >
            {pending ? "Enviando..." : "Solicitar orçamento"}
          </Button>
        </form>
      )}
    </div>
  )
}
