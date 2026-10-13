"use client";

/**
 * Cursor image trail, adapted from React Bits "Image Trail" (variant 1):
 * https://reactbits.dev/animations/image-trail
 * Source: https://github.com/DavidHDev/react-bits
 * Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.
 * Used here as part of a website, as the licence permits.
 *
 * Changes: typed `TrailAsset[]` input, next/image, mouse-only pointer events,
 * render loop that sleeps when idle, decorative (aria-hidden) output.
 */

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { TrailAsset } from "@/config/site-assets";

const THRESHOLD = 90; // px of pointer travel between two images
const SMOOTHING = 0.1;

export default function ImageTrail({ images }: { images: TrailAsset[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length === 0) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-trail-item]"),
    );
    const mouse = { x: 0, y: 0 };
    const last = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let index = -1;
    let z = 1;
    let active = 0;
    let inside = false;
    let raf: number | null = null;

    const local = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const show = () => {
      index = (index + 1) % items.length;
      const el = items[index];
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      gsap.killTweensOf(el);
      gsap
        .timeline({
          onStart: () => void active++,
          onComplete: () => {
            active--;
            if (active === 0) z = 1;
          },
        })
        .fromTo(
          el,
          {
            opacity: 1,
            scale: 1,
            zIndex: ++z,
            x: smooth.x - w / 2,
            y: smooth.y - h / 2,
          },
          {
            duration: 0.4,
            ease: "power1",
            x: mouse.x - w / 2,
            y: mouse.y - h / 2,
          },
          0,
        )
        .to(el, { duration: 0.4, ease: "power3", opacity: 0, scale: 0.2 }, 0.4);
    };

    const tick = () => {
      smooth.x += (mouse.x - smooth.x) * SMOOTHING;
      smooth.y += (mouse.y - smooth.y) * SMOOTHING;
      if (Math.hypot(mouse.x - last.x, mouse.y - last.y) > THRESHOLD) {
        show();
        last.x = mouse.x;
        last.y = mouse.y;
      }
      raf = inside || active > 0 ? requestAnimationFrame(tick) : null;
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const p = local(e);
      mouse.x = smooth.x = last.x = p.x;
      mouse.y = smooth.y = last.y = p.y;
      inside = true;
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!inside) return onEnter(e);
      const p = local(e);
      mouse.x = p.x;
      mouse.y = p.y;
    };
    const onLeave = () => {
      inside = false;
    };

    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
      items.forEach((el) => gsap.killTweensOf(el));
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-10 overflow-hidden"
    >
      {images.map((img) => (
        <div
          key={img.src}
          data-trail-item
          className="pointer-events-none absolute left-0 top-0 aspect-[1.1] w-[170px] overflow-hidden rounded-2xl border border-white/30 opacity-0 shadow-[0_18px_40px_-14px_rgb(0_20_90/0.7)] [will-change:transform]"
        >
          <Image
            src={img.src}
            alt=""
            fill
            sizes="170px"
            unoptimized
            draggable={false}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
