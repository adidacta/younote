import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable cacheComponents for dynamic routes
  cacheComponents: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;
