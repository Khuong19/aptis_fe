/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/uploads/:path*',
        destination: 'http://localhost:5000/api/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig 