import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // service/showcase photos are served from Unsplash's CDN (see src/lib/images.ts)
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // three ships ESM that must be transpiled for the App Router bundler
  transpilePackages: ["three"],
};

export default nextConfig;
