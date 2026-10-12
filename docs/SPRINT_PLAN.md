# PRINTCOM COMING SOON — SPRINTS V3

One sprint at a time. At the end of each sprint STOP, report files changed, test output, screenshot, and blockers. Do not implement upcoming sprints automatically. Times are rough active development estimates, not promises.

## Sprint 1 — Foundation + Code-native Blueprint (45–90 minutes)
Initialize Next.js App Router / TS strict / Tailwind / npm in CORRECT repo. Create a fully procedural `BlueprintBackground` component: CSS deep blue gradients + fine/strong grids and inline vector SVG technical detail. Add isolated preview route `/lab/blueprint` (remove or gate later). No hero copy, no marquee, no image trail yet. Acceptance: build/lint/typecheck pass; scene matches reference composition, 1440 and 390, no hard background bitmap, SVG decorative aria-hidden and pointer events none.

## Sprint 2 — Semantic Hero + CTA + Responsive (60–90 minutes)
Header `printcom.`, preparation badge, exact copy, H1, CTA `mailto:contact@printcom.ma`, semantic footer, responsive typography and layout. Use backdrop contrast control when needed. Acceptance: copy exact, mailto opens client, desktop/tablet/mobile no overflow, keyboard focus and readability.

## Sprint 3 — React Bits Image Trail (90–150 minutes)
Implement https://reactbits.dev/animations/image-trail as an isolated client component, using only owner-supplied AVIF files from `/public/media/image-trail/`, registered via `src/config/site-assets.ts` (do not invent files or URLs). Check current installation/docs and third-party license. Pointer and touch fallback; reduced motion fallback; interaction boundaries do not interfere with CTA. Acceptance: trail follows pointer when enabled; clean static state by default; no layout shift, CPU runaway or image-clutter.

## Sprint 4 — Authorized Logo Marquee + Art Polish (45–90 minutes)
Create reusable `LogoMarquee` with typed `logos[]` sourced from `src/config/site-assets.ts`; await owner-uploaded, approved SVG logos in `public/media/marquee/` (if none provided, keep component empty/disabled). CSS infinite movement only when logos exist and user has not requested reduced motion. Pause on hover/focus. Refine blueprint annotations, colors and UI per reference. Acceptance: no fabricated endorsements; responsive and accessible.

## Sprint 5 — QA + Protected Preview + Release Gate (60–120 minutes)
Audit build/lint/types, performance, SEO metadata, social screenshot, mobile, keyboard and reduced-motion. Request approval for public release. Preview on Vercel with protection enabled, verify CTA and privacy. Prepare domain switching/rollback procedure for printcom.ma. **No public deployment or DNS changes without explicit user authorization**.

## Required before going public
- Verify and confirm `contact@printcom.ma` mailbox is operational.
- Obtain authorized customer/partner logos for marquee or launch without a logo marquee.
- Confirm logo/brand usage, generated product images, metadata and indexing policy.
- Authorize launch and protected main app.
