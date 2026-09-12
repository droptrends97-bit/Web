/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // `STATIC_EXPORT=1 npm run build` emits a self-contained bundle in out/.
  // Used to host the site as plain files; the dev/server build is unaffected.
  ...(process.env.STATIC_EXPORT ? { output: 'export', images: { unoptimized: true } } : {}),
};

export default nextConfig;
