import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { FormField } from "./form-field"

describe("FormField", () => {
  it("associates the label with the field via htmlFor/id", () => {
    render(
      <FormField label="Nome completo">
        <input />
      </FormField>
    )
    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument()
  })

  it("sets aria-invalid and associates the error message via aria-describedby", () => {
    render(
      <FormField label="E-mail" error="E-mail inválido">
        <input />
      </FormField>
    )
    const field = screen.getByLabelText("E-mail")
    expect(field).toHaveAttribute("aria-invalid", "true")

    const error = screen.getByRole("alert")
    expect(error).toHaveTextContent("E-mail inválido")
    expect(field.getAttribute("aria-describedby")).toBe(error.id)
  })

  it("doesn't set aria-invalid or render an error when there is none", () => {
    render(
      <FormField label="Telefone">
        <input />
      </FormField>
    )
    expect(screen.getByLabelText("Telefone")).not.toHaveAttribute("aria-invalid")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
