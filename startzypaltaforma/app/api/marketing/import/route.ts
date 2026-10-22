import { authorize, fail, jsonBody, ApiError } from '@/lib/server';
import { parseBackup } from '@/lib/backup';
import * as db from '@/lib/store';

export async function POST(req: Request) {
  try {
    const user = await authorize(req, true);
    let backup;
    try { backup = parseBackup(await jsonBody(req)); }
    catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(400, (error as Error).message); }
    let created = 0, skipped = 0;
    for (const [collection, rows] of [['marketing', backup.items], ['events', backup.events]] as const) {
      for (const row of rows) {
        const { id, ...payload } = row;
        try { await db.insert(user, collection, payload, null, id); created++; }
        catch (error) { if (error instanceof ApiError && error.status === 409) skipped++; else throw error; }
      }
    }
    return Response.json({ created, skipped });
  } catch (error) { return fail(error); }
}
