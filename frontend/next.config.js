/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Node.js built-in modules
    if (!isServer) {
      // Don't attempt to import node: native modules
      config.resolve.alias = {
        ...config.resolve.alias,
        // Polyfill or ignore node: imports on the client
        'node:buffer': 'buffer',
        'node:process': 'process/browser',
        'node:stream': 'stream-browserify',
        'node:util': 'util',
        'node:url': 'url',
        'node:http': false,
        'node:https': false,
        'node:zlib': false,
        'node:path': false,
        'node:crypto': false,
      };
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        process: require.resolve('process/browser'),
        path: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        url: require.resolve('url'),
        querystring: require.resolve('querystring-es3'),
        assert: false,
        events: require.resolve('events'),
        constants: false,
        punycode: false,
        perf_hooks: false,
      };
      
      // Provide plugins for process and buffer
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: ['process/browser'],
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig; 
