import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScenarioImageFrame } from "@/components/shared/scenario-image";
import type { ScenarioImage } from "@/lib/types";

const IMAGE: ScenarioImage = {
  src: "/scenarios/eset-07/hero.webp",
  alt: "Zárkakörleti folyosó esti fényben.",
  width: 1600,
  height: 900,
};

describe("ScenarioImageFrame", () => {
  it("renders the image with its alt text when a scenario image is provided", () => {
    render(<ScenarioImageFrame image={IMAGE} />);
    const img = screen.getByRole("img", { name: IMAGE.alt });
    expect(img.tagName).toBe("IMG");
  });

  it("locks the container's aspect-ratio to the image's native resolution, not the viewport", () => {
    const { container } = render(<ScenarioImageFrame image={IMAGE} />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.aspectRatio).toBe("1600 / 900");
  });

  it("shows a neutral fallback and no <img> element when no image is provided", () => {
    const { container } = render(<ScenarioImageFrame fallbackLabel="A kép fejlesztés alatt." />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("A kép fejlesztés alatt.")).toBeInTheDocument();
  });

  it("falls back to a 16:9 placeholder ratio when no image is provided", () => {
    const { container } = render(<ScenarioImageFrame fallbackLabel="Nincs kép" />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.aspectRatio).toBe("16 / 9");
  });
});
