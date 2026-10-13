# PRINTCOM COMING SOON — DESIGN LOCK V3 (PREMIUM)

**Status: V3 validated 2026-10-12. V3 Premium (centered hero, new copy, catalogue lead popup) approved by the owner 2026-10-13 from `printcom-demo-v3.html` + desktop/mobile screenshots. Supersedes every previous Precision White / Print & Material draft and the old handoff ZIP. Where this file's older sections conflict with the "V3 Premium" section below, V3 Premium wins.**

## V3 Premium (current source of truth)

### Exact copy (preserve text)
- Brand (header, left only; no header badge, no eyebrow): `printcom.`
- Badge, above the H1: `Site en construction`
- H1: `La matière donne envie aux idées.`
- Subtitle: `Tout ce qui porte votre marque.` / `Imprimé avec intention.`
- Description: `Notre site est en cours de construction.` / `Mais, votre projet, lui, peut commencer dès maintenant.`
- Primary CTA: `Demander un devis` → exact href `mailto:contact@printcom.ma` (a genuine mail link; `mailto@printcom.ma` in an earlier brief was a typo and is not a valid link).
- Secondary CTA: `Télécharger notre catalogue` → opens the lead popup (a `button`, not a link).
- Footer: `© 2026 Printcom` · `Bientôt en ligne` · `Impressions qui durent`

### Layout and type
- Centered hero: badge → H1 → subtitle → description → two CTAs → logo marquee (max-width 880px, `min(880px, 85vw)`; `min(100%, 580px)` under 700px) → footer.
- Type scale: Perfect Fourth, base 16px, ratio 1.333: 12 / 16 / 21.33 / 28.43 / 37.90 / 50.52 / 67.34px (Tailwind tokens `text-pf-sm`, `pf-0` … `pf-5`). Font: Inter. Normal letter-spacing everywhere (no negative tracking).
- H1: 50.52px on one line from 1240px wide, 67.34px from 1800px, 37.90px below 1240px (natural, balanced wrapping), 28.43px under 370px.
- Layers: Blueprint → Image Trail → content (header, hero, marquee, footer) → popup (native `<dialog>`, top layer).

### Blueprint
CSS gradients + two inline SVG scenes (landscape from 1024px up, portrait below), marks spread evenly: crosshairs, registration targets, dashed circles and arcs, CMJN chips, DÉCOUPE / PLIAGE / FAÇONNAGE / IMPRESSION, ruler `300 / 150 / 0 mm`, A4 outline `A4 · 210 × 297 mm`, `FORMAT · PRINT` outline. Decorative drafting annotations only. Never a bitmap background.

### Lead popup
Trigger `Télécharger notre catalogue`. Title `Recevez notre catalogue`. Fields: Nom complet*, Email professionnel*, Téléphone, Entreprise, Votre projet*, required consent. Submit label (exact): `Obtenir mon catalogue`. Success and error states are honest: no catalogue file exists, so none is ever offered. See `docs/BACKEND_SETUP.md`.

---

## V3 base (kept for history; copy and layout below are superseded where noted)


## Canonical visual reference

- `public/design-reference/approved-blueprint-immersive.png`: latest approved blue landing-page screenshot, for visual comparison only.
- `public/design-reference/blueprint-background-reference.png`: generated blueprint background reference, for visual comparison only. **Do not render this image as the background**; code it with CSS and SVG.
- Cursor/Image Trail reference: https://reactbits.dev/animations/image-trail

## Locked stack
Next.js App Router + React + TypeScript (strict) + Tailwind CSS + npm, deployed to Vercel ONLY after owner approval. Prefer latest compatible stable versions when starting the implementation. No Webflow, no Canvas/WebGL needed for the blueprint.

## Exact approved copy — SUPERSEDED by V3 Premium above
- Header brand: `printcom.`
- Header badge: `Site en préparation`
- Eyebrow: `L’ART DE L’IMPRESSION COMMERCIALE`
- H1: `La matière donne vie aux idées.`
- Subheading: `Tout ce qui porte votre marque. Imprimé avec intention.`
- Secondary: `Notre site est en préparation. Votre projet, lui, peut commencer dès maintenant.`
- CTA visible label: `Demander un devis`
- CTA exact href: `mailto:contact@printcom.ma` (mail app, not a web quote form). Do not alter.
- Footer: `© 2026 Printcom` · `Bientôt en ligne` · `Impressions qui durent`

## Art direction: BLUEPRINT IMMERSIVE

A premium dark/cobalt-blue technical blueprint with editorial Apple-inspired typography and restrained interface.
- Base blues: deep marine/cobalt gradient; very subtle lighting, no generic neon overload.
- Fine square drafting grid, stronger structural grid. CSS gradients, responsive, no bitmap backgrounds.
- Native inline SVG overlay: crosshair registration targets, circles, dashed construction arcs, measurement rules, light drafting lines, dashed A4 rectangle, hatch fill, cropped crosses and indicators.
- Technical print-UI text: `CMJN` swatches in cyan/magenta/yellow/key, `DÉCOUPE`, `PLIAGE`, `FAÇONNAGE`, `IMPRESSION`, illustrative `A4 210 × 297 mm`, measurement ruler 0–300 mm. These are visual drafting annotations, NOT real specs of any pictured commercial product.
- White typography, large H1, clear CTA white pill with dark ink. Keep negative space around left reading column.
- Blueprint is CSS + SVG, e.g. `BlueprintBackground.tsx` with pointer-events none, aria-hidden true, separate from semantic content. SVG gradients and shapes should be resize-aware; avoid distorted labels.

## Hero interactive visual — React Bits Image Trail

The original visual depicts cards floating in a diagonal cursor path; actual interaction comes from `Image Trail`: https://reactbits.dev/animations/image-trail. Use official React Bits TS + Tailwind or CSS version, check currently documented dependencies and licensing, and keep as a client-only island. **Static screenshot tiles are reference art, not the animation implementation.**
**Owner-controlled assets only**: the owner chooses the AVIF photos. Source folder: `public/media/image-trail/`; ordered list defined in `src/config/site-assets.ts` after initialization. Accept any nonzero number selected by the owner; no requirement to display five preselected generated PNGs. The approved mockup can show brochure, flyers, tote bag, X-banner and event signage as stylistic examples, **not mandated production assets**. Do not invent/download replacement images or silently use earlier PNG mockups. Until AVIF files are supplied, the client component stays disabled or displays a deliberate dev-only empty-state. The blueprint and copy must work without these assets. See `docs/ASSET_GUIDE.md`.

The trail must not block CTA clicks or obscure the H1. When pointer/touch/reduced motion is unavailable, use a stable, beautiful composition of 2–3 products. Dynamically import interactive component only in client layer if beneficial. Do not saturate page with all images at rest. Never use mockup/reference pictures as content automatically.

## Logo marquee

Insert an infinite animated logo marquee BELOW the CTA, but above footer. Purpose: show Printcom has an active business. Only render real, **approved/authorized existing customer/partner logos** supplied later by the owner in `public/media/marquee/` as sanitized SVG files and registered in `src/config/site-assets.ts`; mock/fake client endorsements are forbidden. Until real logos arrive, build a component accepting `logos[]` and render nothing or a clear developer-only placeholder; DO NOT publish invented third-party logos, random icons, or fictional brand names as customer logos.
Marquee must pause on hover/focus, support `prefers-reduced-motion` with static wrapped logo grid, and give appropriate accessible labels.

## Layout — SUPERSEDED by V3 Premium above

At 1440px wide: header; centered vertically hero with left copy column ~55% and right/center interactive Image Trail zone ~45%; CTA clear; marquee below; short thin-line footer. On small laptop ensure content fits or scrolls naturally. At 390px: CTA and hero copy first, reduce drafting annotation count, Image Trail falls back to static or touch-safe; logo rail reduces without content loss. No horizontal scroll.

## Strict scope and gates
- Existing main application repo `printcom.ma` stays untouched and protected.
- The Coming Soon repo is separate: `amineelba/printcom-coming-soon` unless user confirms a different remote.
- No DNS changes, no Vercel production deployment, no site publication until explicit approval.
- No invented business claims, customer logos, countdown or deadline.
- Validate preview using desktop (1440x900), tablet (768x1024), mobile (390x844).
- All copy must be real HTML text and CTA a genuine `mailto:` anchor.
- Respect focus-visible, AA contrast, screen readers, reduced motion, minimal runtime JS.
