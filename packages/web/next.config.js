const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
})

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  ...withBundleAnalyzer({
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    async rewrites() {
      return [
        {
          source: '/ingest/:path*',
          destination: 'https://app.posthog.com/:path*',
        },
      ]
    },
  }),
})

// if (process.env.NODE_ENV === 'development') {
//   // we import the utility from the next-dev submodule
//   const { setupDevBindings } = require('@cloudflare/next-on-pages/next-dev');

//   // we call the utility with the bindings we want to have access to
//   setupDevBindings({
//     kvNamespaces: ['MY_KV_1', 'MY_KV_2'],
//     r2Buckets: ['MY_R2'],
//     durableObjects: {
//       MY_DO: {
//         scriptName: 'do-worker',
//         className: 'DurableObjectClass',
//       },
//     },
//     // ...
//   });
// }
