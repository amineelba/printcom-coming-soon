import type { Metadata } from "next";
import { BlueprintBackground } from "@/components/blueprint/BlueprintBackground";

// Isolated Sprint 1 preview. Remove or gate before release (Sprint 5).
export const metadata: Metadata = {
  title: "Lab — Blueprint",
  robots: { index: false, follow: false },
};

export default function BlueprintLab() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0a3fc2]">
      <BlueprintBackground />
    </main>
  );
}
