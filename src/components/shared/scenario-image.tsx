"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import type { ScenarioImage as ScenarioImageType } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Fix aspect-ratio konténer a forráskép tényleges felbontásából számolva.
 *
 * Ez a robusztus válasz arra, hogy `object-fit: contain` esetén a letterbox-terület
 * elcsúsztatná a százalékos hotspot-koordinátákat: mivel a konténer aránya PONTOSAN
 * megegyezik a kép natív arányával, az `object-cover` nem vág be semmit és nem
 * hagy letterbox-sávot – a kép 1:1 kitölti a konténert, így minden % koordináta,
 * amit a konténerhez viszonyítva helyezünk el, pontosan a kép ugyanazon pontjára esik,
 * bármilyen responsive szélességnél.
 *
 * A `children` overlay-eket (hotspotok, info chipek) a konténer overflow-visible
 * gyökerében helyezzük el, a kép maga egy külön overflow-hidden rétegben van.
 */
export function ScenarioImageFrame({
  image,
  alt,
  className,
  imageClassName,
  priority,
  sizes = "100vw",
  fallbackLabel = "A vizuális tartalom fejlesztés alatt még nem elérhető.",
  children,
}: {
  image?: ScenarioImageType;
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  fallbackLabel?: string;
  children?: ReactNode;
}) {
  const [errored, setErrored] = useState(false);
  const ratio = image ? `${image.width} / ${image.height}` : "16 / 9";

  if (!image || errored) {
    return (
      <div
        className={cn("relative flex items-center justify-center bg-surface-raised", className)}
        style={{ aspectRatio: ratio }}
        role="img"
        aria-label={fallbackLabel}
      >
        <div className="px-4 text-center text-xs text-muted-foreground">
          <ImageOff className="mx-auto mb-2 h-5 w-5" aria-hidden="true" />
          {fallbackLabel}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} style={{ aspectRatio: ratio }}>
      <div className={cn("absolute inset-0 overflow-hidden", imageClassName)}>
        <Image
          src={image.src}
          alt={alt ?? image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
          onError={() => setErrored(true)}
        />
      </div>
      {children}
    </div>
  );
}
