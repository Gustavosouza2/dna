import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { QuoteForm } from "./quote-form"

const submitButton = () =>
  screen.getByRole("button", { name: "Solicitar orçamento" })

function fillTextFields() {
  const values: Array<[string, string]> = [
    ["Nome completo", "Maria Silva"],
    ["E-mail", "maria@exemplo.com"],
    ["Telefone", "11947064090"],
    ["Origem", "São Paulo/SP"],
    ["Destino", "Manaus/AM"],
    ["Tipo de carga", "Eletrônicos"],
    ["Peso / volume", "500kg"],
  ]
  for (const [label, value] of values) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  }
}

describe("QuoteForm", () => {
  it("keeps submission blocked while required fields are empty", () => {
    render(<QuoteForm />)
    expect(submitButton()).toBeDisabled()
  })

  it("stays blocked with the text fields filled but consent unchecked", async () => {
    render(<QuoteForm />)

    fillTextFields()

    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it("stays blocked with consent checked but required fields empty", async () => {
    render(<QuoteForm />)

    fireEvent.click(screen.getByRole("checkbox"))

    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it("stays blocked while the transport type is not selected", async () => {
    render(<QuoteForm />)

    fillTextFields()
    fireEvent.click(screen.getByRole("checkbox"))

    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it("reports invalid values as the user types", async () => {
    render(<QuoteForm />)

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "não-é-email" },
    })

    expect(await screen.findByText("E-mail inválido")).toBeInTheDocument()
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
