/**
 * Photos are hot-linked from Unsplash's CDN, which is what Unsplash's licence expects.
 * Replace any of them with the brand's own work by pointing `src` at a file in /public instead.
 */
export const unsplash = (photoId: string, width = 1200) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=75`;
