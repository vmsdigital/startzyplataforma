/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  async rewrites() { return { beforeFiles: [{ source: '/', destination: '/index.html' }], afterFiles: [], fallback: [] }; },
  async headers() { return [
    { source: '/app/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'private, no-store' }] },
    { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'private, no-store' }, { key: 'X-Content-Type-Options', value: 'nosniff' }] },
    { source: '/entrar', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ]; },
};
export default config;
