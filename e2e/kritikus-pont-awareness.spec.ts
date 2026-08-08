import { expect, test } from "@playwright/test";

test("Kritikus pont – parancsnoki nézetből helyszíni tudatossági feladatba érkezés", async ({ page }) => {
  await page.goto("/szituacio/muvelet-kritikus-pont");

  // 1. Helyzet (brief) — closing complex exercise framing, control-room hero image.
  await expect(page.getByText("ZÁRÓ SZITUÁCIÓ").first()).toBeVisible();
  await expect(page.getByText("Záró komplex szituáció").first()).toBeVisible();
  await page.getByRole("button", { name: "Kezdés" }).waitFor({ state: "visible" });

  // 2. Megfigyelés
  await page.getByRole("button", { name: "Kezdés" }).click();
  await expect(page.getByText("Megfigyelés", { exact: true })).toBeVisible({ timeout: 10_000 });

  const observationItems = page.getByRole("checkbox");
  await observationItems.first().click();
  await page.getByRole("button", { name: "Megerősítés" }).click();
  await page.getByRole("button", { name: "Tovább" }).click();

  // 3. Priorizálás — well-reasoned option that keeps the scenario moving toward the field view.
  await page.getByRole("button", { name: /Gyors, rövid értékelést végzel mindhárom jelzésről/ }).click();
  await expect(page.getByText("Döntésed")).toBeVisible();
  await page.getByRole("button", { name: "Tovább" }).click();

  // 4. Helyszíni tudatosság — command/information view -> field view narrative shift.
  await expect(page.getByText("Helyszíni tudatosság")).toBeVisible();
  await expect(page.getByText(/Váltás történt/)).toBeVisible();

  // Category/label must stay hidden until a marker is actually found.
  await expect(page.getByText("Ismeretlen okból jelenlévő személy")).not.toBeVisible();

  const continueButton = page.getByRole("button", { name: "Tovább" });
  await expect(continueButton).toBeDisabled();

  // Point hotspot.
  await page.getByRole("button", { name: "1. jelölhető pont a helyszínen" }).click();
  await expect(page.getByText("Azonosított elemek (1/5)")).toBeVisible();

  // Area hotspot ("biztonságos megközelítési távolság" — relational, not a physical point).
  await page.getByRole("button", { name: "5. jelölhető pont a helyszínen" }).click();
  await expect(page.getByText("Azonosított elemek (2/5)")).toBeVisible();

  await page.getByRole("button", { name: "3. jelölhető pont a helyszínen" }).click();
  await expect(page.getByText("Azonosított elemek (3/5)")).toBeVisible();

  await expect(continueButton).toBeEnabled();

  // The now-found marker reveals a neutral framing, never "suspicious perpetrator" or "dangerous person".
  await expect(page.getByText("Ismeretlen okból jelenlévő személy")).toBeVisible();
  await expect(page.getByText(/gyanús elkövető|veszélyes személy/i)).not.toBeVisible();
});
