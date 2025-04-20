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
  // Add output configuration for better Vercel compatibility
  output: 'standalone',
  // Increase serverless function timeout
  serverRuntimeConfig: {
    timeout: 60, // seconds
  },
}

export default nextConfig
