/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['placeholder.supabase.co'],
  },
}

module.exports = nextConfig
