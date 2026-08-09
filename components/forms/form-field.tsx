"use client"

import { cloneElement, isValidElement, useId, type ReactElement } from "react"

import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  error?: string
  /**
   * Single controlled child (Input/Textarea/SelectTrigger...). Gets
   * `id`/`aria-invalid`/`aria-describedby` injected automatically —
   * don't pass `id` on it manually.
   */
  children: ReactElement
}

/**
 * Label associated with the field (`htmlFor`/`id`) + error announced
 * via `aria-invalid`/`aria-describedby` — an accessibility audit found
 * the forms didn't have this (docs/adr/0011 didn't cover the detail,
 * fixed here as a finding from the improvement sweep).
 */
export function FormField({ label, error, children }: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  const field = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })
    : children

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {field}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
