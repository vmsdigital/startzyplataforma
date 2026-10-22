import 'server-only';
import { session } from './auth';
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
export async function authorize(request: Request, write = false) {
  const user = await session();
  if (!user) throw new ApiError(401, 'Entre na sua conta para continuar.');
  if (write) checkOrigin(request);
  return user;
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get('origin');
  // Next may use an internal hostname in request.url behind a reverse proxy.
  const host = request.headers.get('host') || new URL(request.url).host;
  const protocol = process.env.NODE_ENV === 'production' ? 'https:' : new URL(request.url).protocol;
  if (request.headers.get('sec-fetch-site') === 'cross-site' || !origin || origin !== `${protocol}//${host}`) throw new ApiError(403, 'Origem não autorizada.');
}
export async function jsonBody(req: Request) {
  if (Number(req.headers.get('content-length') || 0) > 1_000_000) throw new ApiError(413, 'Limite de 1 MB.');
  const body = await req.text();
  if (Buffer.byteLength(body) > 1_000_000) throw new ApiError(413, 'Limite de 1 MB.');
  try { return JSON.parse(body); } catch { throw new ApiError(400, 'JSON inválido.'); }
}
export function fail(e: unknown) {
  if (e instanceof ApiError) return Response.json({ error: e.message }, { status: e.status });
  console.error('Falha na operação Startzy:', e instanceof Error ? e.message : 'erro');
  return Response.json({ error: 'Não foi possível concluir. Confira a configuração ou tente novamente.' }, { status: 500 });
}
export function externalKey(l: { externalId: string; name: string; city: string; state: string }) {
  if (l.externalId) return 'ext:' + l.externalId;
  const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  return 'company:' + norm(l.name) + '|' + norm(l.city) + '|' + norm(l.state);
}
