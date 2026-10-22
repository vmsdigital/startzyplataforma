import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { type Session, supabase } from './auth';
import { ApiError } from './server';
type Collection = 'leads' | 'marketing' | 'events' | 'imports';
type Row = { owner_id: string; collection: Collection; id: string; payload: Record<string, any>; version: number; created_at: string; updated_at: string; external_key: string | null };
const localFile = () => path.join(process.cwd(), '.local', 'workspace.json');
declare global { var startzyWriteQueue: Promise<any> | undefined; }
async function localRows(): Promise<Row[]> { try { return JSON.parse(await fs.readFile(localFile(), 'utf8')); } catch (e: any) { if (e.code === 'ENOENT') return []; throw e; } }
async function mutate<T>(fn: (rows: Row[]) => T | Promise<T>): Promise<T> {
  const task = (globalThis.startzyWriteQueue || Promise.resolve()).catch(() => {}).then(async () => {
    const rows = await localRows(); const value = await fn(rows);
    await fs.mkdir(path.dirname(localFile()), { recursive: true });
    const temporary = localFile() + '.' + crypto.randomUUID() + '.tmp';
    await fs.writeFile(temporary, JSON.stringify(rows), 'utf8'); await fs.rename(temporary, localFile()); return value;
  });
  globalThis.startzyWriteQueue = task; return task;
}
const unpack = (r: Row) => ({ ...r.payload, id: r.id, version: r.version, createdAt: r.created_at, updatedAt: r.updated_at });
function dbError(error: any) { if (error?.code === '23505') throw new ApiError(409, 'Este registro já existe. Confira a empresa e a cidade.'); throw new Error(error?.message || 'Falha no banco de dados.'); }
export async function list(user: Session, collection: Collection): Promise<any[]> {
  if (user.local) return (await localRows()).filter(r => r.owner_id === user.id && r.collection === collection).sort((a,b) => b.updated_at.localeCompare(a.updated_at)).map(unpack);
  const client = await supabase(); const { data, error } = await client.from('startzy_records').select('*').eq('owner_id', user.id).eq('collection', collection).order('updated_at', { ascending: false });
  if (error) dbError(error); return (data || []).map(unpack);
}
export async function insert(user: Session, collection: Collection, payload: Record<string, any>, key: string | null = null, id = crypto.randomUUID()) {
  const at = new Date().toISOString();
  const row: Row = { owner_id: user.id, collection, id, payload, version: 1, external_key: key, created_at: at, updated_at: at };
  if (user.local) return mutate(rows => { if (rows.some(r => r.owner_id === user.id && r.collection === collection && (r.id === id || (key && r.external_key === key)))) throw new ApiError(409, 'Este registro já existe.'); rows.push(row); return unpack(row); });
  const client = await supabase(); const { data, error } = await client.from('startzy_records').insert(row).select().single(); if (error) dbError(error); return unpack(data);
}
export async function update(user: Session, collection: Collection, id: string, version: number, payload: Record<string, any>, key: string | null = null) {
  if (!id || !Number.isInteger(version) || version < 1) throw new ApiError(400, 'Registro ou versão inválida.');
  if (user.local) return mutate(rows => {
    const row = rows.find(r => r.owner_id === user.id && r.collection === collection && r.id === id);
    if (!row) throw new ApiError(404, 'Registro não encontrado.'); if (row.version !== version) throw new ApiError(409, 'Este registro mudou em outra aba. Atualize antes de salvar.');
    if (key && rows.some(r => r.owner_id === user.id && r.collection === collection && r.id !== id && r.external_key === key)) throw new ApiError(409, 'Esta empresa já existe.');
    row.payload = payload; row.external_key = key; row.version++; row.updated_at = new Date().toISOString(); return unpack(row);
  });
  const client = await supabase(); const { data, error } = await client.from('startzy_records').update({ payload, external_key: key, version: version + 1, updated_at: new Date().toISOString() }).eq('owner_id', user.id).eq('collection', collection).eq('id', id).eq('version', version).select().maybeSingle();
  if (error) dbError(error); if (!data) throw new ApiError(409, 'O registro foi alterado ou excluído. Atualize a página.'); return unpack(data);
}
export async function remove(user: Session, collection: Collection, id: string, version: number) {
  if (!id || !Number.isInteger(version)) throw new ApiError(400, 'Registro inválido.');
  if (user.local) return mutate(rows => { const i = rows.findIndex(r => r.owner_id === user.id && r.collection === collection && r.id === id && r.version === version); if (i < 0) throw new ApiError(409, 'Registro alterado ou excluído.'); rows.splice(i,1); return { ok: true }; });
  const client = await supabase(); const { data, error } = await client.from('startzy_records').delete().eq('owner_id', user.id).eq('collection', collection).eq('id', id).eq('version', version).select('id');
  if (error) dbError(error); if (!data?.length) throw new ApiError(409, 'Registro alterado ou excluído.'); return { ok: true };
}
export async function seed(user: Session, records: Record<string, any>[]) {
  const at = new Date().toISOString(); const rows: Row[] = records.map(p => ({ owner_id: user.id, collection: 'marketing', id: 'seed-' + p.code, payload: p, version: 1, external_key: null, created_at: at, updated_at: at }));
  if (user.local) return mutate(existing => { let created=0; for (const row of rows) if (!existing.some(r => r.owner_id === user.id && r.collection === 'marketing' && r.id === row.id)) { existing.push(row); created++; } return { created }; });
  const client = await supabase(); const { data, error } = await client.from('startzy_records').upsert(rows, { onConflict: 'owner_id,collection,id', ignoreDuplicates: true }).select('id'); if (error) dbError(error); return { created: data?.length || 0 };
}
