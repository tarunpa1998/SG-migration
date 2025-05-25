/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Use the standalone output option for better deployment
  output: 'standalone',
  distDir: '.next',
  // Configure webpack for SVG support
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  // External packages
  serverExternalPackages: ['mongodb'],
  // Other experimental features
  experimental: {
    esmExternals: true,
    // Add memory optimizations
    webpackMemoryOptimizations: true
  },
  // Add environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Disable static generation for pages that fetch data
  // This will prevent build-time fetch errors
  staticPageGenerationTimeout: 120,
}

export default nextConfig;




