import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // serverActions: true, // Enabled by default in Next 14+
  },
  // Disable production source maps to reduce build size
  productionBrowserSourceMaps: false,
};

export default nextConfig;
