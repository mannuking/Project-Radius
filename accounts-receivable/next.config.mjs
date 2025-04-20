/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['firebasestorage.googleapis.com'],
  },
  // Compatibility settings for stable deployment on Vercel
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['firebase'],
  },
  // Increase serverless function timeout
  serverRuntimeConfig: {
    timeout: 60, // seconds
  },
  webpack: (config) => {
    // Fix issues with the undici package
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: require.resolve('undici'),
    };
    return config;
  },
}

export default nextConfig
