import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Required for hosting on GitHub Pages
  output: 'export',

  // 2. Ensures assets (CSS/Images) load correctly on sub-repo URLs
  // This reads from the GitHub Action environment during the build
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // 3. Required because GitHub Pages doesn't support Next.js Image Optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
