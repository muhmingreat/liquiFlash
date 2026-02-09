/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for Vercel build timeout
  experimental: {
     turbopack: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false };
    config.resolve.alias = {
        ...config.resolve.alias,
        '@solana/kit': false,
        '@solana-program/token': false,
        '@solana-program/system': false,
        'porto': false,
        'porto/internal': false,
    };
    return config;
  },
}

export default nextConfig
