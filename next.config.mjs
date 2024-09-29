/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    level: 'info',
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: [
      'puppeteer-core',
      '@sparticuz/chromium-min',
      '@sparticuz/chromium',
      '@aws-sdk',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shadcn-ui-sidebar.salimi.my',
      },
      {
        protocol: 'https',
        hostname: 'ui.shadcn.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 's3.biznatop.com',
      },
      {
        protocol: 'https',
        hostname: 'media.biznatop.com',
      },
    ],
  },
  output: 'standalone',
};

import withSerwistInit from '@serwist/next';
import { nanoid } from 'nanoid';

const revision = nanoid();

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  cacheOnNavigation: true,
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development' ? true : false,
  cacheOnNavigation: true,
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
});

export default withSerwist({
  // Your Next.js config
  ...nextConfig,
});

// export default nextConfig;
