import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production Edge Performance & Optimization Settings
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Configured Edge & Cache Headers
  async headers() {
    return [
      {
        // Immutable caching for pre-compiled Next.js client bundles and chunks
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cached sample PDFs and clinical documentation with SWR support
        source: '/samples/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Universal security and privacy headers across all application routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
