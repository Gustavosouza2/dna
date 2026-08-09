import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ContactForm } from "./contact-form"

describe("ContactForm", () => {
  it("shows validation errors on empty submit, without calling the API", async () => {
    render(<ContactForm />)

    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(await screen.findByText("Informe seu nome completo")).toBeInTheDocument()
    expect(
      screen.getByText("Escreva uma mensagem um pouco mais detalhada")
    ).toBeInTheDocument()
  })

  it("phone and subject are optional: they don't block submission", async () => {
    render(<ContactForm />)

    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }))
    await screen.findByText("Informe seu nome completo")

    expect(screen.queryByText(/telefone/i, { selector: "p[role='alert']" })).not.toBeInTheDocument()
  })
})
