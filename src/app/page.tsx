import { BlueprintBackground } from "@/components/blueprint/BlueprintBackground";
import { TrailOverlay } from "@/components/trail/TrailOverlay";
import { LogoMarquee } from "@/components/marquee/LogoMarquee";
import { marqueeLogos, trailImages } from "@/config/site-assets";
import { Hero } from "@/components/site/Hero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <BlueprintBackground />
      <TrailOverlay images={trailImages} />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center px-[22px] pb-[50px] pt-[75px] max-[700px]:px-5 max-[700px]:pb-12 max-[700px]:pt-[65px]">
          <Hero />
          <div className="mt-[65px] w-full max-[700px]:mt-12">
            <LogoMarquee logos={marqueeLogos} />
          </div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
