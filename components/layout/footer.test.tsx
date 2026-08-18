import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Footer } from "./footer"

describe("Footer", () => {
  it("renders the quick links (no Contato, matching the current site)", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "/services")
    expect(screen.getByRole("link", { name: "Sobre nós" })).toHaveAttribute("href", "/about")
    expect(screen.queryByRole("link", { name: "Contato" })).not.toBeInTheDocument()
  })

  it("links to the privacy policy and terms of use", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Política de privacidade" })).toHaveAttribute(
      "href",
      "/privacy"
    )
    expect(screen.getByRole("link", { name: "Termos de uso" })).toHaveAttribute(
      "href",
      "/terms"
    )
  })

  it("renders the contact email as a mailto link", () => {
    render(<Footer />)
    const link = screen.getByRole("link", { name: "comercial@dnaaircargo.com.br" })
    expect(link).toHaveAttribute("href", "mailto:comercial@dnaaircargo.com.br")
  })
})
