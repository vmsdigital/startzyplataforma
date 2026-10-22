import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next({ request });
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  const local = process.env.NODE_ENV === 'development' && process.env.STARTZY_LOCAL_DEMO === '1' && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(request.headers.get('host') || '');
  if (local) return response;
  let current = response;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  let authorized = false;
  if (url && key && process.env.STARTZY_ALLOWED_EMAILS) {
    const client = createServerClient(url, key, {
      cookieOptions: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' },
      cookies: { getAll: () => request.cookies.getAll(), setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        current = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => current.cookies.set(name, value, options));
        current.headers.set('Cache-Control', 'private, no-store');
        current.headers.set('X-Robots-Tag', 'noindex, nofollow');
      } },
    });
    try {
      const { data, error } = await client.auth.getClaims();
      const email = String(data?.claims?.email || '').toLowerCase();
      authorized = !error && Boolean(data?.claims?.sub) && process.env.STARTZY_ALLOWED_EMAILS.split(',').some(x => x.trim().toLowerCase() === email);
    } catch { authorized = false; }
  }
  if (!authorized && path.startsWith('/app')) {
    const destination = new URL('/entrar', request.url);
    destination.searchParams.set('retorno', path + request.nextUrl.search);
    const redirect = NextResponse.redirect(destination);
    current.cookies.getAll().forEach(c => redirect.cookies.set(c));
    redirect.headers.set('Cache-Control', 'private, no-store');
    return redirect;
  }
  return current;
}
export const config = { matcher: ['/app/:path*', '/entrar', '/api/:path*'] };
