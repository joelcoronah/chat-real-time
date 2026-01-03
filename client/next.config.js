/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable image optimization for external images
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig

