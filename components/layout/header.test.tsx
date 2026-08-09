import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
}))

import { Header } from "./header"

describe("Header", () => {
  it("renders every nav item with the correct href", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "/services")
    expect(screen.getByRole("link", { name: "Solicitar orçamento" })).toHaveAttribute(
      "href",
      "/quote"
    )
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute("href", "/contact")
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("href", "/about")
  })

  it("marks the nav item matching the current route (usePathname) as active", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveClass("text-blue-600")
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("text-blue-600")
  })

  it("links the logo to the home page", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: /Dna Air Cargo/ })).toHaveAttribute("href", "/")
  })
})
