import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.STARTZY_ALLOWED_EMAILS);
export const allowed = (email: string) => (process.env.STARTZY_ALLOWED_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
export const isLocalDemo = (host: string) => process.env.NODE_ENV === 'development' && process.env.STARTZY_LOCAL_DEMO === '1' && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
export function safeReturn(value: string | null | undefined) { return value && /^\/app(?:\/|\?|$)/.test(value) && !value.includes('\\') ? value : '/app'; }
export async function supabase() {
  if (!configured()) throw new Error('Acesso não configurado.');
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookieOptions: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' },
    cookies: { getAll: () => jar.getAll(), setAll(values) { try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch { /* A sessão é atualizada pelo proxy antes da renderização. */ } } },
  });
}
export type Session = { id: string; email: string; name: string; local: boolean };
export async function session(): Promise<Session | null> {
  const host = (await headers()).get('host') || '';
  if (isLocalDemo(host)) return { id: '00000000-0000-4000-8000-000000000001', email: 'previa@startzy.local', name: 'Vinicius', local: true };
  if (!configured()) return null;
  const client = await supabase();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || !user.email || !allowed(user.email)) return null;
  return { id: user.id, email: user.email, name: user.user_metadata?.full_name || user.email.split('@')[0], local: false };
}
export async function requireSession() { const user = await session(); if (!user) redirect('/entrar'); return user; }
