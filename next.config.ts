import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    localPatterns: [
      {
        pathname: '/tarot/**',
        search: '',
      },
    ],
    remotePatterns: [],
  },
};

export default nextConfig;
