/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.22.240.1', '192.168.42.92'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zpoodcdcksudoyqmeqmx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig