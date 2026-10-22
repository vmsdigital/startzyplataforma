import { configured, allowed, safeReturn, supabase } from '@/lib/auth';
import { checkOrigin, jsonBody, fail, ApiError } from '@/lib/server';
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    if (!configured()) throw new ApiError(503, 'O acesso privado ainda precisa ser configurado pelo administrador.');
    const { email, password, retorno } = await jsonBody(req);
    if (typeof email !== 'string' || typeof password !== 'string' || password.length > 512 || email.length > 250) throw new ApiError(400, 'Informe seu e-mail e senha.');
    if (!allowed(email)) throw new ApiError(401, 'Não foi possível entrar com essas informações.');
    const client = await supabase(); const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new ApiError(401, 'Não foi possível entrar. Confira seu e-mail e senha.');
    return Response.json({ url: safeReturn(retorno) });
  } catch (e) { return fail(e); }
}
