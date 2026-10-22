import { configured, supabase } from '@/lib/auth';
import { checkOrigin, fail } from '@/lib/server';
export async function POST(req: Request) { try { checkOrigin(req); if (configured()) await (await supabase()).auth.signOut(); return Response.json({ url: '/entrar' }); } catch (e) { return fail(e); } }
