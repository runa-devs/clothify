/** @type {import('next').NextConfig} */

import "./src/env/index.js";

const nextConfig = {
  // if you want to use standalone output, uncomment the following line
  // transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  images: {
    remotePatterns: [
      {
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
