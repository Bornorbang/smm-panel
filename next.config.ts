import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/backend-api/api/:path*", destination: "http://localhost:8088/api/:path*" }];
  },
};

export default nextConfig;
