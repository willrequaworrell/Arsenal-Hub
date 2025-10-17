import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
        port: '',
        pathname: '/football/**',
      },
      {
        protocol: 'https',
        hostname: 'media.guim.co.uk', // The Guardian's image CDN
        port: '',
        pathname: '/**', // Allow all Guardian image paths
      },
    ],
  },
};

export default nextConfig;
