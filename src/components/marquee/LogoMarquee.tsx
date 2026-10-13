import Image from "next/image";
import type { MarqueeLogo } from "@/config/site-assets";

// Each loop half is repeated until it is wider than any realistic viewport,
// so the -50% translate loops seamlessly even with few logos.
const MIN_LOGOS_PER_HALF = 16;
const SECONDS_PER_LOGO = 5; // slow, constant speed whatever the logo count

function LogoItem({ logo, hidden }: { logo: MarqueeLogo; hidden: boolean }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className={
        hidden
          ? "marquee-dup relative h-10 w-32 shrink-0 sm:h-12 sm:w-40"
          : "relative h-10 w-32 shrink-0 sm:h-12 sm:w-40"
      }
    >
      <Image
        src={logo.src}
        alt={hidden ? "" : logo.alt}
        fill
        unoptimized
        loading="eager"
        draggable={false}
        sizes="160px"
        className="object-contain"
      />
    </li>
  );
}

/**
 * Infinite logo rail. Server component, CSS-only motion.
 * - Renders nothing without logos.
 * - One accessible copy of the list; every repeat is aria-hidden with alt="".
 * - Pauses on hover and keyboard focus; static wrapped grid when the user
 *   prefers reduced motion (styles in globals.css, `.marquee*`).
 */
export function LogoMarquee({ logos }: { logos: MarqueeLogo[] }) {
  if (logos.length === 0) return null;

  const repeats = Math.ceil(MIN_LOGOS_PER_HALF / logos.length);
  const half = (keyPrefix: string, firstIsReal: boolean) =>
    Array.from({ length: repeats }, (_, r) =>
      logos.map((logo) => (
        <LogoItem
          key={`${keyPrefix}-${r}-${logo.src}`}
          logo={logo}
          hidden={!(firstIsReal && r === 0)}
        />
      )),
    );

  return (
    <section
      aria-label="Logos clients et partenaires"
      tabIndex={0}
      className="marquee mx-6 rounded-2xl border border-white/50 bg-white/92 py-4 shadow-[0_18px_50px_-24px_rgb(0_15_80/0.6)] backdrop-blur-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white sm:mx-10 md:mx-16"
    >
      <div className="marquee-viewport overflow-hidden">
        <div
          className="marquee-track flex w-max"
          style={
            {
              "--marquee-duration": `${repeats * logos.length * SECONDS_PER_LOGO}s`,
            } as React.CSSProperties
          }
        >
          <ul className="marquee-half flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
            {half("a", true)}
          </ul>
          <ul
            aria-hidden="true"
            className="marquee-half marquee-dup flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
          >
            {half("b", false)}
          </ul>
        </div>
      </div>
    </section>
  );
}
