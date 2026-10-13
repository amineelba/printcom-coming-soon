import { BlueprintBackground } from "@/components/blueprint/BlueprintBackground";
import { TrailOverlay } from "@/components/trail/TrailOverlay";
import { trailImages } from "@/config/site-assets";
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
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
