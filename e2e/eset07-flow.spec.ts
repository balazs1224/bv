import { expect, test } from "@playwright/test";

test("ESET 07 – full decision loop from brief to result", async ({ page }) => {
  await page.goto("/szituacio/eset-07");

  // 1. Helyzet (brief) — real hero image + structured info panel, not a marketing banner.
  await expect(page.getByText("ESET 07").first()).toBeVisible();
  await page.getByRole("button", { name: "Kezdés" }).waitFor({ state: "visible" });

  // 2. Megfigyelés (observation) — text-based relevance selection, distinct from the awareness map.
  await page.getByRole("button", { name: "Kezdés" }).click();
  await expect(page.getByText("Megfigyelés", { exact: true })).toBeVisible({ timeout: 10_000 });

  const observationItems = page.getByRole("checkbox");
  await observationItems.first().click();
  await observationItems.nth(1).click();
  await page.getByRole("button", { name: "Megerősítés" }).click();
  await page.getByRole("button", { name: "Tovább" }).click();

  // 3. Első döntési pont — choose the well-reasoned option and check the feedback loop fields.
  await page.getByRole("button", { name: /Felméred a helyzetet/ }).click();
  await expect(page.getByText("Döntésed")).toBeVisible();
  await expect(page.getByText("Fennmaradó kockázat")).toBeVisible();
  await expect(page.getByText("A döntés hatására módosult")).toBeVisible();
  await page.getByRole("button", { name: "Tovább" }).click();

  // 4. Helyszíni tudatosság — real photo-based hotspots, not the same mechanic as observation.
  await expect(page.getByText("Helyszíni tudatosság")).toBeVisible();
  const continueButton = page.getByRole("button", { name: "Tovább" });
  await expect(continueButton).toBeDisabled();
  for (let i = 1; i <= 3; i++) {
    await page.getByRole("button", { name: `${i}. jelölhető pont a helyszínen` }).click();
  }
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  // 5. Deeszkalációs kommunikáció — pick the calm, professional option.
  await expect(page.getByText("Deeszkalációs kommunikáció")).toBeVisible();
  await page.getByRole("button", { name: /Látom, hogy feszült a helyzet/ }).click();
  await expect(page.getByText("Kommunikáció értékelve")).toBeVisible();
  await page.getByRole("button", { name: "Tovább" }).click();

  // 6. Eredmény — competency-first result screen, not a bare score.
  await expect(page.getByText("Szituáció lezárva")).toBeVisible();
  await expect(page.getByText(/Döntési minőség/)).toBeVisible();
  await expect(page.getByText("Kockázatkezelés")).toBeVisible();
  await expect(page.getByText("Következő ajánlott gyakorlat")).toBeVisible();
});
