import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wireguard-config-allowed-ips-calculator",
  assetPrefix: "/wireguard-config-allowed-ips-calculator",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
