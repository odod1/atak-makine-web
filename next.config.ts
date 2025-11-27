import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  async redirects() {
    return [
      {
        source: "/makineler",
        destination: "/urunler",
        permanent: true,
      },
      {
        source: "/makineler/:slug*",
        destination: "/urunler/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
