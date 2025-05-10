/** @type {import('next').NextConfig} */

import "./src/env/index.js";

const nextConfig = {
  // if you want to use standalone output, uncomment the following line
  // transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  images: {
    remotePatterns: [
      {
        hostname: "clothify-images.runa.dev",
      },
    ],
  },
};

export default nextConfig;
