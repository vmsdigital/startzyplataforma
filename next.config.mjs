/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  async redirects() { return [
    { source: '/marketing', destination: '/app/marketing', permanent: false },
    { source: '/prospect', destination: '/app/prospect', permanent: false },
    { source: '/login', destination: '/entrar', permanent: false },
  ]; },
  async headers() { return [
    { source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    { source: '/app/:path*', headers: [{ key: 'Cache-Control', value: 'private, no-store' }] },
    { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'private, no-store' }, { key: 'X-Content-Type-Options', value: 'nosniff' }] },
    { source: '/entrar', headers: [{ key: 'Cache-Control', value: 'private, no-store' }] },
  ]; },
};
export default config;
