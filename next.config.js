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
  // Set the output directory to match your server expectations
  distDir: '.next',
  // Configure webpack for SVG support
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  // Use serverExternalPackages instead of serverComponentsExternalPackages
  serverExternalPackages: ['mongodb'],
  // Other experimental features
  experimental: {
    esmExternals: true
  }
}

export default nextConfig;



