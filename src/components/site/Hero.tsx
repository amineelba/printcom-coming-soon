import { CatalogueLead } from "@/components/lead/CatalogueLead";
import { ACTION_PRIMARY } from "./actions";

const QUOTE_HREF = "mailto:contact@printcom.ma";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex w-full max-w-[1500px] flex-col items-center text-center [text-shadow:0_2px_25px_rgb(5_30_115/0.35)]"
    >
      {/* soft dark halo behind the copy for contrast over the blueprint / trail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-5 -top-[70px] -bottom-[55px] -z-10 bg-[radial-gradient(ellipse_55%_73%_at_50%_43%,rgb(4_37_125/0.65)_0%,rgb(4_37_125/0.25)_54%,transparent_85%)]"
      />

      <p className="mb-[29px] inline-flex items-center gap-[9px] rounded-full border border-white/40 bg-[#092e8e]/80 px-[17px] py-[9px] text-pf-sm font-medium text-white shadow-[0_6px_28px_rgb(9_36_103/0.25)] max-[700px]:mb-6">
        <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-[#53b8ff] shadow-[0_0_9px_#60b9ff]" />
        Site en construction
      </p>

      <h1
        id="hero-title"
        className="mx-auto max-w-[920px] text-pf-3 font-[540] leading-[1.12] text-balance text-white min-[1240px]:max-w-full min-[1240px]:text-pf-4 min-[1240px]:whitespace-nowrap min-[1800px]:text-pf-5 max-[370px]:text-pf-2"
      >
        La matière donne envie aux idées.
      </h1>

      <p className="mt-6 text-pf-1 font-[430] leading-[1.45] max-[700px]:mt-[22px]">
        <span className="block">Tout ce qui porte votre marque.</span>
        <span className="block">Imprimé avec intention.</span>
      </p>

      <p className="mt-[18px] max-w-[710px] text-pf-0 leading-[1.65] text-white/85">
        <span className="block">Notre site est en cours de construction.</span>
        <span className="block">Mais, votre projet, lui, peut commencer dès maintenant.</span>
      </p>

      <div className="mt-[30px] flex flex-wrap justify-center gap-3 max-[700px]:mt-[25px] max-[700px]:w-[min(100%,330px)] max-[700px]:flex-col max-[700px]:items-stretch">
        <a href={QUOTE_HREF} className={ACTION_PRIMARY}>
          Demander un devis
          <span aria-hidden="true">↗</span>
        </a>
        <CatalogueLead />
      </div>
    </section>
  );
}
