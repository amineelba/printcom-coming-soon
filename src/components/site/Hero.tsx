import { trailImages } from "@/config/site-assets";
import { TrailZone } from "@/components/trail/TrailZone";

const QUOTE_HREF = "mailto:contact@printcom.ma";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex flex-1 items-center px-6 py-12 sm:px-10 md:px-16 md:py-10"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-[11fr_9fr]">
        <div className="max-w-[46rem] [text-shadow:0_1px_20px_rgb(5_30_120/0.5)]">
          <p className="mb-5 text-[0.7rem] font-normal tracking-[0.28em] text-white/80 sm:text-xs">
            L’ART DE L’IMPRESSION COMMERCIALE
          </p>
          <h1
            id="hero-title"
            className="text-[clamp(2.75rem,7vw,6.25rem)] lg:text-[clamp(2.75rem,6.2vw,6.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-balance text-white lg:text-wrap"
          >
            La matière donne vie aux idées.
          </h1>
          <p className="mt-8 max-w-md text-[clamp(1.2rem,1.7vw,1.6rem)] font-normal leading-snug text-white">
            <span className="block">Tout ce qui porte votre marque.</span>{" "}
            <span className="block">Imprimé avec intention.</span>
          </p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-[1.05rem]">
            <span className="block">Notre site est en préparation.</span>{" "}
            <span className="block">Votre projet, lui, peut commencer dès maintenant.</span>
          </p>
          <a
            href={QUOTE_HREF}
            className="mt-9 inline-flex min-h-14 items-center gap-4 rounded-full bg-white px-8 text-lg font-medium text-[#0a1a40] shadow-[0_10px_40px_-10px_rgb(0_20_90/0.6)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Demander un devis
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12L12 4M5.5 4H12v6.5" />
            </svg>
          </a>
        </div>

        {/* Sprint 3: owner-supplied images only. Empty list keeps the
            column reserved on desktop and renders nothing. */}
        {trailImages.length > 0 ? (
          <TrailZone images={trailImages} />
        ) : (
          <div aria-hidden="true" className="hidden min-h-[26rem] lg:block" />
        )}
      </div>
    </section>
  );
}
