import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AwarenessMap } from "@/components/scenario/awareness-map";
import type { Scenario, Stage } from "@/lib/types";

const scenario = {
  visual: {
    awareness: {
      src: "/scenarios/eset-07/awareness.webp",
      alt: "Helyzetfelismerési feladathoz tartozó helyszíni kép.",
      width: 1600,
      height: 900,
    },
  },
} as unknown as Scenario;

const stage = {
  id: "awareness",
  type: "awareness-map",
  title: "Helyszíni tudatosság",
  question: "Mit vennél észre a helyszínen?",
  awarenessMarkers: [
    { id: "m1", type: "point", x: 20, y: 30, category: "szemely", label: "Feldúlt fogvatartott", correct: true, note: "Note A" },
    { id: "m2", type: "point", x: 60, y: 45, category: "kamera", label: "CCTV kamera", correct: true, note: "Note B" },
    { id: "m3", type: "area", x: 10, y: 10, width: 20, height: 15, category: "tavolsag", label: "Biztonságos távolság", correct: true, note: "Note C" },
  ],
} as unknown as Stage;

describe("AwarenessMap", () => {
  it("renders unfound hotspots fully transparent, with no visible circle, number, or color", () => {
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const pointHotspot = screen.getByRole("button", { name: "1. jelölhető pont a helyszínen" });
    const areaHotspot = screen.getByRole("button", { name: "3. jelölhető pont a helyszínen" });

    // No visible ordinal number or checkmark is rendered before discovery.
    expect(pointHotspot).toHaveTextContent("");
    expect(areaHotspot).toHaveTextContent("");

    // No colored/warning styling and no dashed outline before discovery (production, non-debug).
    expect(pointHotspot.className).toContain("bg-transparent");
    expect(pointHotspot.className).not.toContain("border-warning");
    expect(pointHotspot.className).not.toContain("bg-warning");
    expect(areaHotspot.className).not.toContain("border-dashed");
  });

  it("toggles a point hotspot and updates the found count", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const pointHotspot = screen.getByRole("button", { name: "1. jelölhető pont a helyszínen" });
    expect(pointHotspot).toHaveAttribute("aria-pressed", "false");

    await user.click(pointHotspot);

    expect(pointHotspot).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Azonosított elemek (1/3)")).toBeInTheDocument();
  });

  it("toggles an area hotspot independently of point hotspots", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const areaHotspot = screen.getByRole("button", { name: "3. jelölhető pont a helyszínen" });
    expect(areaHotspot).toHaveAttribute("aria-pressed", "false");

    await user.click(areaHotspot);

    expect(areaHotspot).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "1. jelölhető pont a helyszínen" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("does not reveal the marker category before it is found", () => {
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);
    expect(screen.queryByText("Feldúlt fogvatartott")).not.toBeInTheDocument();
    expect(screen.queryByText("CCTV kamera")).not.toBeInTheDocument();
  });

  it("shows a non-punishing message and no reveal when clicking an empty area of the image", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const scene = screen.getByRole("group", { name: /Helyszíni fotó/ });
    await user.click(scene);

    expect(
      screen.getAllByText("Ezen a területen nincs kiemelt jel. Nézd át a helyszínt tovább.").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Azonosított elemek (0/3)")).toBeInTheDocument();
  });

  it("enables continuing only once the minimum number of markers is found, then reports the result", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={onContinue} />);

    const continueButton = screen.getByRole("button", { name: "Tovább" });
    expect(continueButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "1. jelölhető pont a helyszínen" }));
    await user.click(screen.getByRole("button", { name: "2. jelölhető pont a helyszínen" }));
    await user.click(screen.getByRole("button", { name: "3. jelölhető pont a helyszínen" }));

    expect(continueButton).toBeEnabled();
    await user.click(continueButton);
    expect(onContinue).toHaveBeenCalledWith({ found: 3, total: 3 });
  });

  it("mixes real markers with generic decoys in the accessible list, so it cannot be solved by blindly clicking every entry", () => {
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const list = screen.getByRole("list");
    const listButtons = within(list).getAllByRole("button");

    // 3 real markers + 3 generic, scenario-agnostic decoys — more entries than real signals.
    expect(listButtons).toHaveLength(6);
    // Pre-discovery, every entry (marker or decoy) reads identically — no way to tell them apart.
    for (const button of listButtons) {
      expect(button).toHaveTextContent("Lehetséges jel a helyszínen");
    }
  });

  it("resolves every accessible-list entry to either a found marker or a non-punishing miss, ending with exactly the real markers found", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const list = screen.getByRole("list");
    const listButtons = within(list).getAllByRole("button");

    for (const button of listButtons) {
      await user.click(button);
      const found = button.getAttribute("aria-pressed") === "true";
      if (!found) {
        expect(
          screen.getAllByText("Ezen a területen nincs kiemelt jel. Nézd át a helyszínt tovább.").length
        ).toBeGreaterThan(0);
      }
    }

    expect(screen.getByText("Azonosított elemek (3/3)")).toBeInTheDocument();
  });

  it("lets an accessible-list entry be activated via the keyboard alone", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const list = screen.getByRole("list");
    const [firstButton] = within(list).getAllByRole("button");

    firstButton.focus();
    expect(firstButton).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(firstButton).toHaveAttribute("aria-pressed", "true");
  });
});
