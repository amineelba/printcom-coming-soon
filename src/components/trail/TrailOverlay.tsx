"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import type { TrailAsset } from "@/config/site-assets";

// gsap and the trail logic load only when the trail can actually run.
const ImageTrail = dynamic(() => import("./ImageTrail"), { ssr: false });

const QUERIES = [
  "(hover: hover) and (pointer: fine)",
  "(prefers-reduced-motion: no-preference)",
];

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((m) => m.addEventListener("change", onChange));
  return () => lists.forEach((m) => m.removeEventListener("change", onChange));
}
const canTrail = () => QUERIES.every((q) => window.matchMedia(q).matches);

/**
 * Fullscreen trail layer. Mouse-only: touch devices and reduced-motion users
 * get nothing (no static cards). Server snapshot is false, so no image is
 * rendered or requested on load. Renders nothing without images.
 */
export function TrailOverlay({ images }: { images: TrailAsset[] }) {
  const enabled = useSyncExternalStore(subscribe, canTrail, () => false);
  if (!enabled || images.length === 0) return null;
  return <ImageTrail images={images} />;
}
