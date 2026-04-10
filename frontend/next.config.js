/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'znkvizblryesyrsockty.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad1-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad1-2.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad1-3.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad1-4.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad2-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad2-2.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad2-3.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad2-4.fna.fbcdn.net',
      },
    ],
  },
};

module.exports = nextConfig;
