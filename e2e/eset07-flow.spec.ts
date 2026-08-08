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

  // 4a. Hotspots must not be visible before discovery: no rendered number/checkmark, and a
  // transparent background — production/non-debug must not draw circles or areas up front.
  const firstHotspot = page.getByRole("button", { name: "1. jelölhető pont a helyszínen" });
  await expect(firstHotspot).toHaveText("");
  const bg = await firstHotspot.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg === "rgba(0, 0, 0, 0)" || bg === "transparent").toBe(true);

  // 4b. Clicking an empty area of the scene must not punish — gentle message, counter unchanged.
  const scene = page.getByRole("group", { name: /Helyszíni fotó/ });
  const sceneBox = await scene.boundingBox();
  if (!sceneBox) throw new Error("awareness scene not found");
  await scene.click({ position: { x: sceneBox.width * 0.05, y: sceneBox.height * 0.95 } });
  await expect(page.getByText("Ezen a területen nincs kiemelt jel. Nézd át a helyszínt tovább.").first()).toBeVisible();
  await expect(page.getByText("Azonosított elemek (0/7)")).toBeVisible();

  // 4c. Correct-area clicks work and the found counter advances.
  for (let i = 1; i <= 3; i++) {
    await page.getByRole("button", { name: `${i}. jelölhető pont a helyszínen` }).click();
  }
  await expect(page.getByText("Azonosított elemek (3/7)")).toBeVisible();
  await expect(continueButton).toBeEnabled();

  // 4d. Fullscreen ("Helyszín megnyitása") still exposes the same interactive hotspots.
  await page.getByRole("button", { name: "Helyszín megnyitása" }).click();
  const dialog = page.getByRole("dialog", { name: /nagyított nézet/ });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "4. jelölhető pont a helyszínen" }).click();
  await expect(dialog.getByText("Azonosított elemek: 4/7")).toBeVisible();
  await dialog.getByRole("button", { name: "Nagyított nézet bezárása" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByText("Azonosított elemek (4/7)")).toBeVisible();

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
