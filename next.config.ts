import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing (XSS vector)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Block iframe embedding — prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Don't leak referrer to external sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not needed by this app
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // Content-Security-Policy — primary XSS defence
  // 'unsafe-inline' on script/style is required for Next.js app-router hydration;
  // everything else is locked down tight.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // unsafe-eval needed only in dev (HMR/fast-refresh); strip it in production
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",                // inline styles used throughout
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com", // Vercel Blob, data URIs, blob preview
      "font-src 'self'",
      "connect-src 'self' https://*.public.blob.vercel-storage.com", // fetch() + Vercel Blob upload
      "media-src 'none'",
      "object-src 'none'",
      "frame-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        // Apply to every route
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;