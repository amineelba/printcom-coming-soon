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
        <main className="flex flex-1 flex-col">
          <Hero />
          <div className="pb-8 md:pb-10">
            <LogoMarquee logos={marqueeLogos} />
          </div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
