"use client";

/**
 * Fullscreen cursor image trail, adapted from React Bits "Image Trail"
 * (variant 1): https://reactbits.dev/animations/image-trail
 * Source: https://github.com/DavidHDev/react-bits
 * Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.
 * Used here as part of a website, as the licence permits.
 *
 * Changes: window-level pointer tracking, small reusable DOM pool, images
 * fetched progressively (look-ahead of a few items, never all at once), card
 * size from each image's own aspect ratio (no cropping), render loop that
 * sleeps when the pointer is idle. Output is decorative (aria-hidden).
 */

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import type { TrailAsset } from "@/config/site-assets";

const POOL_SIZE = 6; // max cards alive at once (controls overlap)
const LOOKAHEAD = 2; // images fetched ahead of the one being shown
const THRESHOLD = 120; // px of pointer travel between two cards
const SMOOTHING = 0.1;
const IDLE_MS = 300;

type Entry = { img: HTMLImageElement; ready: boolean; failed: boolean };

export default function ImageTrail({ images }: { images: TrailAsset[] }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || images.length === 0) return;

    // Long side of a card: 280–340px depending on viewport width.
    const longSide = () =>
      Math.round(Math.min(340, Math.max(280, window.innerWidth * 0.21)));

    // Reusable pool, created empty: no <img> src, nothing visible or fetched.
    const pool = Array.from({ length: POOL_SIZE }, () => {
      const card = document.createElement("div");
      card.className =
        "absolute left-0 top-0 overflow-hidden rounded-2xl opacity-0 shadow-[0_22px_50px_-16px_rgb(0_20_90/0.75)] [will-change:transform]";
      const img = document.createElement("img");
      img.alt = "";
      img.draggable = false;
      img.decoding = "async";
      img.className = "block h-full w-full object-contain";
      card.append(img);
      layer.append(card);
      return { card, img, busy: false };
    });

    const cache = new Map<number, Entry>();
    const ensure = (i: number): Entry => {
      let entry = cache.get(i);
      if (!entry) {
        const img = new Image();
        entry = { img, ready: false, failed: false };
        const e = entry;
        img.onload = () => void (e.ready = true);
        img.onerror = () => void (e.failed = true);
        img.src = images[i].src;
        cache.set(i, entry);
      }
      return entry;
    };

    const mouse = { x: 0, y: 0 };
    const last = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let next = 0;
    let z = 1;
    let busyCount = 0;
    let lastMove = 0;
    let raf: number | null = null;
    let seeded = false;

    const show = () => {
      const slot = pool.find((s) => !s.busy);
      if (!slot) return; // pool exhausted: skip, never pile up

      let entry = ensure(next);
      for (let k = 1; k <= LOOKAHEAD; k++) ensure((next + k) % images.length);
      if (entry.failed) {
        next = (next + 1) % images.length;
        entry = ensure(next);
      }
      if (!entry.ready) return; // not downloaded yet: try on the next step

      const { naturalWidth: nw, naturalHeight: nh } = entry.img;
      const side = longSide();
      const w = nw >= nh ? side : Math.round((side * nw) / nh);
      const h = nw >= nh ? Math.round((side * nh) / nw) : side;
      slot.img.src = entry.img.src;
      slot.card.style.width = `${w}px`;
      slot.card.style.height = `${h}px`;
      next = (next + 1) % images.length;

      slot.busy = true;
      busyCount++;
      gsap.killTweensOf(slot.card);
      gsap
        .timeline({
          onComplete: () => {
            slot.busy = false;
            busyCount--;
            if (busyCount === 0) z = 1;
          },
        })
        .fromTo(
          slot.card,
          {
            opacity: 1,
            scale: 1,
            zIndex: ++z,
            x: smooth.x - w / 2,
            y: smooth.y - h / 2,
          },
          {
            duration: 0.55,
            ease: "power2.out",
            x: mouse.x - w / 2,
            y: mouse.y - h / 2,
          },
          0,
        )
        .to(
          slot.card,
          { duration: 0.5, ease: "power2.in", opacity: 0, scale: 0.6 },
          0.55,
        );
    };

    const tick = () => {
      smooth.x += (mouse.x - smooth.x) * SMOOTHING;
      smooth.y += (mouse.y - smooth.y) * SMOOTHING;
      if (Math.hypot(mouse.x - last.x, mouse.y - last.y) > THRESHOLD) {
        show();
        last.x = mouse.x;
        last.y = mouse.y;
      }
      const idle = performance.now() - lastMove > IDLE_MS;
      raf = idle && busyCount === 0 ? null : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMove = performance.now();
      if (!seeded) {
        // First move: nothing is fetched or shown before this.
        seeded = true;
        smooth.x = last.x = mouse.x;
        smooth.y = last.y = mouse.y;
        for (let k = 0; k <= LOOKAHEAD; k++) ensure(k % images.length);
      }
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf !== null) cancelAnimationFrame(raf);
      pool.forEach(({ card }) => {
        gsap.killTweensOf(card);
        card.remove();
      });
      cache.forEach(({ img }) => {
        img.onload = img.onerror = null;
      });
    };
  }, [images]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] h-dvh w-screen overflow-hidden"
    />
  );
}
