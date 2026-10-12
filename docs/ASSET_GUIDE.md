# Owner-supplied media — mandatory implementation contract

## General rule
The owner, not Claude Code, provides and approves ALL photographs used in Image Trail and ALL logos used in Logo Marquee. No stock, generated product-photo substitutes, made-up brands, or automatically scraped logos. If files are absent, the page must still render successfully. Missing assets are not an excuse to generate misleading mockups.

## Filesystem

```
public/
  media/
    image-trail/  # user-uploaded .avif images
    marquee/      # user-uploaded, reviewed .svg logos
```

The folders are committed with README files until real assets arrive.

## Single manifest to create in Sprint 3 / extend in Sprint 4
`src/config/site-assets.ts`:

```ts
export type TrailAsset = { src: string; alt: string };
export type MarqueeLogo = { src: string; alt: string; href?: string };

// Start empty until the owner supplies and approves images.
export const trailImages: TrailAsset[] = [];
export const marqueeLogos: MarqueeLogo[] = [];
```

Owner adds local URLs like `/media/image-trail/brochure-01.avif` only after the corresponding file is committed. Preserve owner-defined array order. Do not scan directory and assume every upload is approved for display.

## Image Trail
- AVIF native images, dimensions/quality selected based on actual subject; editorial suggestion 800–1200px long side. Transparency optional.
- Do not rename/convert/replace files silently. Optimize only with consent and keep source.
- Trail should run only with sufficient supplied images and pointer capability; protect CTA and copy; mobile/reduced-motion fallback uses a small curated static selection or no images.
- Main site copy, blueprint background and mailto CTA must be fully functional with 0 trail images.

## Marquee
- Only licensed/permissioned customer or partner logos supplied as clean SVG. Preserve original aspect ratio and colors as approved. Do not automatically recolor brands without approval.
- Validate SVG content for security: remove scripts, event handlers, foreignObject, external requests or unsafe embeds. Prefer serving as `img`/Next Image asset instead of injecting raw SVG markup into DOM.
- Use `alt` for the exact approved business name; no fake endorsements. If no logos are supplied, render nothing, don't invent logos or fake silhouettes.
- For motion: infinite scroll only with consent and >=2 real logos, pause on hover/focus, static grid for reduced motion.

## Approval steps
1. Owner uploads AVIF/SVG files and selects their order.
2. Claude checks filenames/types and logo sanitization; reports broken/missing refs.
3. Owner approves displayed images/logos in protected preview.
4. Only then request permission for public release.

No public Vercel deployment, no DNS changes, and no modification to the main Printcom repository.
