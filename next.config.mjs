// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // enables static export
  reactStrictMode: true,
  // Suppress hydration warnings (use with caution, for development only)
  // experimental: {
  //   suppressHydrationWarning: true,
  // },
  images: {
    unoptimized: true, // disable AVIF optimization for Turbopack
  },
};

export default nextConfig;
