import { expect, test } from "@playwright/test"

test.describe("Contact form", () => {
  test("shows validation errors on empty submit, without navigating", async ({ page }) => {
    await page.goto("/contact")

    await page.getByRole("button", { name: "Enviar mensagem" }).click()

    await expect(page.getByText("Informe seu nome completo")).toBeVisible()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test("submits successfully and allows sending another message", async ({ page }) => {
    await page.goto("/contact")

    await page.getByLabel("Nome completo").fill("João Souza")
    await page.getByLabel("E-mail").fill("joao@example.com")
    await page
      .getByLabel("Mensagem")
      .fill("Preciso de mais informações sobre transporte fluvial.")

    await page.getByRole("checkbox").click()

    await page.getByRole("button", { name: "Enviar mensagem" }).click()

    await expect(page.getByText("Mensagem enviada com sucesso!")).toBeVisible()

    await page.getByRole("button", { name: "Enviar outra mensagem" }).click()
    await expect(page.getByLabel("Nome completo")).toBeVisible()
    await expect(page.getByLabel("Nome completo")).toHaveValue("")
  })

  test("phone and subject are optional", async ({ page }) => {
    await page.goto("/contact")

    await page.getByLabel("Nome completo").fill("Ana Lima")
    await page.getByLabel("E-mail").fill("ana@example.com")
    await page.getByLabel("Mensagem").fill("Gostaria de saber mais sobre os prazos de entrega.")
    await page.getByRole("checkbox").click()

    await page.getByRole("button", { name: "Enviar mensagem" }).click()

    await expect(page.getByText("Mensagem enviada com sucesso!")).toBeVisible()
  })
})
