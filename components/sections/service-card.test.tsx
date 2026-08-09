import { render, screen } from "@testing-library/react"
import { PlaneIcon, ShipIcon, TruckIcon } from "lucide-react"
import { describe, expect, it } from "vitest"

import { ServiceCard } from "./service-card"

describe("ServiceCard", () => {
  it("renders title, description and link for the air slug", () => {
    render(
      <ServiceCard
        icon={PlaneIcon}
        title="Transporte aéreo"
        description="Entregas rápidas e seguras."
        href="/services/air"
        variant="air"
      />
    )

    expect(screen.getByText("Transporte aéreo")).toBeInTheDocument()
    expect(screen.getByText("Entregas rápidas e seguras.")).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute("href", "/services/air")
  })

  it("renders the correct link for road", () => {
    render(
      <ServiceCard
        icon={TruckIcon}
        title="Transporte rodoviário"
        description="Frota moderna."
        href="/services/road"
        variant="road"
      />
    )
    expect(screen.getByRole("link")).toHaveAttribute("href", "/services/road")
  })

  it("renders the correct link for river", () => {
    render(
      <ServiceCard
        icon={ShipIcon}
        title="Transporte fluvial"
        description="Soluções econômicas."
        href="/services/river"
        variant="river"
      />
    )
    expect(screen.getByRole("link")).toHaveAttribute("href", "/services/river")
  })
})
