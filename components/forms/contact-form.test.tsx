import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ContactForm } from "./contact-form"

const submitButton = () => screen.getByRole("button", { name: "Enviar mensagem" })

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Nome completo"), {
    target: { value: "Maria Silva" },
  })
  fireEvent.change(screen.getByLabelText("E-mail"), {
    target: { value: "maria@exemplo.com" },
  })
  fireEvent.change(screen.getByLabelText("Mensagem"), {
    target: { value: "Gostaria de saber mais sobre os serviços." },
  })
}

describe("ContactForm", () => {
  it("keeps submission blocked while required fields are empty", () => {
    render(<ContactForm />)
    expect(submitButton()).toBeDisabled()
  })

  it("stays blocked with all fields filled but consent unchecked", async () => {
    render(<ContactForm />)

    fillRequiredFields()

    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it("stays blocked with consent checked but required fields empty", async () => {
    render(<ContactForm />)

    fireEvent.click(screen.getByRole("checkbox"))

    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it("enables submission once required fields and consent are filled", async () => {
    render(<ContactForm />)

    fillRequiredFields()
    fireEvent.click(screen.getByRole("checkbox"))

    await waitFor(() => expect(submitButton()).toBeEnabled())
  })

  it("phone and subject are optional: they don't block submission", async () => {
    render(<ContactForm />)

    fillRequiredFields()
    fireEvent.click(screen.getByRole("checkbox"))

    await waitFor(() => expect(submitButton()).toBeEnabled())
    expect(
      screen.queryByText(/telefone/i, { selector: "p[role='alert']" })
    ).not.toBeInTheDocument()
  })

  it("reports invalid values as the user types", async () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "não-é-email" },
    })

    expect(await screen.findByText("E-mail inválido")).toBeInTheDocument()
  })
})
