/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,

    remotePatterns: [
      { protocol: 'https', hostname: '**.pinimg.com' },
      { protocol: 'https', hostname: '**.flaticon.com' },
    ],
  },
};

export default nextConfig;
