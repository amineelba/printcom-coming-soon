import Image from "next/image";
import type { MarqueeLogo } from "@/config/site-assets";

// Each loop half is repeated until it is wider than any realistic viewport,
// so the -50% translate loops seamlessly even with few logos.
const MIN_LOGOS_PER_HALF = 16;
const SECONDS_PER_LOGO = 4; // slow, constant speed whatever the logo count

function LogoItem({ logo, hidden }: { logo: MarqueeLogo; hidden: boolean }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className={
        hidden
          ? "marquee-dup relative h-10 w-[105px] shrink-0 min-[701px]:h-[43px] min-[701px]:w-[120px]"
          : "relative h-10 w-[105px] shrink-0 min-[701px]:h-[43px] min-[701px]:w-[120px]"
      }
    >
      <Image
        src={logo.src}
        alt={hidden ? "" : logo.alt}
        fill
        unoptimized
        loading="eager"
        draggable={false}
        sizes="120px"
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
      className="marquee mx-auto w-[min(880px,85vw)] max-w-full rounded-[13px] border border-white/60 bg-white/93 py-3.5 shadow-[0_12px_40px_rgb(0_22_92/0.27)] backdrop-blur-[9px] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white max-[700px]:w-[min(100%,580px)]"
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
          <ul className="marquee-half flex shrink-0 items-center gap-6 pr-6 min-[701px]:gap-12 min-[701px]:pr-12">
            {half("a", true)}
          </ul>
          <ul
            aria-hidden="true"
            className="marquee-half marquee-dup flex shrink-0 items-center gap-6 pr-6 min-[701px]:gap-12 min-[701px]:pr-12"
          >
            {half("b", false)}
          </ul>
        </div>
      </div>
    </section>
  );
}
