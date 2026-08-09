import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { QuoteForm } from "./quote-form"

describe("QuoteForm", () => {
  it("shows validation errors on empty submit, without calling the API", async () => {
    render(<QuoteForm />)

    fireEvent.click(screen.getByRole("button", { name: "Solicitar orçamento" }))

    expect(await screen.findByText("Informe seu nome completo")).toBeInTheDocument()
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument()
  })

  it("associates each label with its respective field", () => {
    render(<QuoteForm />)
    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument()
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument()
    expect(screen.getByLabelText("Telefone")).toBeInTheDocument()
    expect(screen.getByLabelText("Tipo de transporte")).toBeInTheDocument()
    expect(screen.getByLabelText("Origem")).toBeInTheDocument()
    expect(screen.getByLabelText("Destino")).toBeInTheDocument()
  })
})
