import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CtaBand } from "./cta-band"

describe("CtaBand", () => {
  it("renders title, description and the buttons passed as children", () => {
    render(
      <CtaBand title="Pronto para começar?" description="Fale com a gente hoje mesmo.">
        <button>Solicitar orçamento</button>
      </CtaBand>
    )

    expect(screen.getByRole("heading", { name: "Pronto para começar?" })).toBeInTheDocument()
    expect(screen.getByText("Fale com a gente hoje mesmo.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Solicitar orçamento" })).toBeInTheDocument()
  })
})
