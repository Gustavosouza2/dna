import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Reveal } from "./reveal"

describe("Reveal", () => {
  it("renders its children", () => {
    render(
      <Reveal>
        <p>content</p>
      </Reveal>
    )
    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("starts hidden (opacity 0) before entering the viewport", () => {
    render(
      <Reveal>
        <p>content</p>
      </Reveal>
    )
    const wrapper = screen.getByText("content").parentElement
    expect(wrapper).toHaveStyle({ opacity: "0" })
  })
})
