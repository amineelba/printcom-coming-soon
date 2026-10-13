"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import type { TrailAsset } from "@/config/site-assets";

// gsap + trail logic load only when the interactive mode is actually used.
const ImageTrail = dynamic(() => import("./ImageTrail"), { ssr: false });

const MIN_TRAIL_IMAGES = 3;
const MAX_STATIC_IMAGES = 3;
const QUERIES = [
  "(min-width: 1024px)",
  "(hover: hover) and (pointer: fine)",
  "(prefers-reduced-motion: no-preference)",
];

// Interactive only on wide, hover-capable, fine-pointer screens without
// reduced-motion. Server snapshot is false so SSR renders the static state.
function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((m) => m.addEventListener("change", onChange));
  return () => lists.forEach((m) => m.removeEventListener("change", onChange));
}
const canTrail = () => QUERIES.every((q) => window.matchMedia(q).matches);

const CARD_POSITIONS = [
  "left-[4%] top-[4%] w-[52%] -rotate-3",
  "right-[2%] top-[30%] w-[50%] rotate-2",
  "left-[14%] bottom-[2%] w-[48%] -rotate-1",
];

/**
 * Right-hand visual zone. Always shows a calm static composition of up to 3
 * owner-approved images; on capable desktops a cursor trail is layered on top.
 * Renders nothing without images.
 */
export function TrailZone({ images }: { images: TrailAsset[] }) {
  const interactive = useSyncExternalStore(subscribe, canTrail, () => false);

  if (images.length === 0) return null;

  const statics = images.slice(0, MAX_STATIC_IMAGES);
  return (
    <div
      id="image-trail-zone"
      className="relative h-[24rem] w-full sm:h-[28rem] lg:h-[34rem]"
    >
      <ul className="absolute inset-0">
        {statics.map((img, i) => (
          <li
            key={img.src}
            className={`absolute aspect-[1.1] overflow-hidden rounded-2xl border border-white/30 shadow-[0_18px_40px_-14px_rgb(0_20_90/0.7)] ${CARD_POSITIONS[i]}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 24vw, 60vw"
              unoptimized
              className="object-cover"
            />
          </li>
        ))}
      </ul>
      {interactive && images.length >= MIN_TRAIL_IMAGES ? (
        <ImageTrail images={images} />
      ) : null}
    </div>
  );
}
