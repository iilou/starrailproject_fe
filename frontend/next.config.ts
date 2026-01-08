import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    // domains: ["raw.githubusercontent.com", "api.hakush.in", "homdgcat.wiki"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.hakush.in",
      },
      {
        protocol: "https",
        hostname: "homdgcat.wiki",
      },
    ],
  },
};

export default nextConfig;
