import { expect, test } from "@playwright/test"

test.describe("Quote form", () => {
  test("shows validation errors on empty submit, without navigating", async ({ page }) => {
    await page.goto("/quote")

    await page.getByRole("button", { name: "Solicitar orçamento" }).click()

    await expect(page.getByText("Informe seu nome completo")).toBeVisible()
    await expect(page).toHaveURL(/\/quote$/)
  })

  test("submits successfully and allows sending another request", async ({ page }) => {
    await page.goto("/quote")

    await page.getByLabel("Nome completo").fill("Maria Silva")
    await page.getByLabel("E-mail").fill("maria@example.com")
    await page.getByLabel("Telefone").fill("11999999999")

    await page.getByLabel("Tipo de transporte").click()
    await page.getByRole("option", { name: "Aéreo" }).click()

    await page.getByLabel("Origem").fill("São Paulo/SP")
    await page.getByLabel("Destino").fill("Rio de Janeiro/RJ")
    await page.getByLabel("Tipo de carga").fill("Eletrônicos")
    await page.getByLabel("Peso / volume").fill("10kg")

    await page.getByRole("checkbox").click()

    await page.getByRole("button", { name: "Solicitar orçamento" }).click()

    await expect(page.getByText("Solicitação enviada com sucesso!")).toBeVisible()

    await page.getByRole("button", { name: "Enviar outra solicitação" }).click()
    await expect(page.getByLabel("Nome completo")).toBeVisible()
    await expect(page.getByLabel("Nome completo")).toHaveValue("")
  })
})
