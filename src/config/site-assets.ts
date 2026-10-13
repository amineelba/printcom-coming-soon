// Owner-controlled media manifest. See docs/ASSET_GUIDE.md.
// Only add an entry after the matching file is committed under
// public/media/image-trail/. Array order = display order.

export type TrailAsset = { src: string; alt: string };

// Start empty until the owner supplies and approves images.
export const trailImages: TrailAsset[] = [];
