import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Never ship source maps to the browser: the original components stay out of DevTools.
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // The API serves uploads from a private / loopback address in development and on the LAN;
    // the image optimizer refuses those unless explicitly allowed. Never enabled in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
