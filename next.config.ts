import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundles the demo SQLite snapshot into serverless functions on platforms
  // with a read-only filesystem (e.g. Vercel). Only relevant when
  // DATABASE_URL points at prisma/demo.db (see README "Deploy" section).
  outputFileTracingIncludes: {
    "/**": ["./prisma/demo.db"],
  },
};

export default nextConfig;
