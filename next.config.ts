import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wireguard-allowed-ips-calculator",
  assetPrefix: "/wireguard-allowed-ips-calculator",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
