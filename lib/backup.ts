import { z } from 'zod';
import { marketingSchema, eventSchema } from './marketing.ts';

const id = z.string().regex(/^[a-zA-Z0-9_-]{1,120}$/, 'ID inválido no arquivo.');
const item = marketingSchema.extend({ id });
const event = eventSchema.extend({ id });
const schema = z.object({ schemaVersion: z.literal(1), items: z.array(item).max(200), events: z.array(event).max(100) });
export function parseBackup(raw: unknown) {
  const result = schema.safeParse(raw);
  if (!result.success) throw new Error('Arquivo de Marketing inválido: ' + result.error.issues[0].message);
  if (!result.data.items.length && !result.data.events.length) throw new Error('Este arquivo está vazio.');
  return result.data;
}
