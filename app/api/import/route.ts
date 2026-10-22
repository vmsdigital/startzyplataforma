import { authorize, fail, jsonBody, externalKey, ApiError } from '@/lib/server';
import { normalizeImport } from '@/lib/domain';
import * as db from '@/lib/store';
export async function GET(req:Request){try{return Response.json((await db.list(await authorize(req),'imports')).slice(0,10).map(x=>({...x,created_at:x.createdAt})));}catch(e){return fail(e);}}
export async function POST(req:Request){try{const user=await authorize(req,true);let leads;try{leads=normalizeImport(await jsonBody(req));}catch(e){if(e instanceof ApiError)throw e;throw new ApiError(400,(e as Error).message);}let created=0;for(const lead of leads){try{await db.insert(user,'leads',{...lead,history:[...(lead.history||[]),{at:new Date().toISOString(),text:'Importação revisada'}].slice(-80)},externalKey(lead));created++;}catch(e){if(!(e instanceof ApiError&&e.status===409))throw e;}}await db.insert(user,'imports',{count:created});return Response.json({created,skipped:leads.length-created});}catch(e){return fail(e);}}
