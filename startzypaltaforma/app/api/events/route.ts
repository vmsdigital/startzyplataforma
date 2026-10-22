import { authorize,fail,jsonBody,ApiError } from '@/lib/server';
import { eventSchema } from '@/lib/marketing';
import * as db from '@/lib/store';
export async function GET(req:Request){try{return Response.json(await db.list(await authorize(req),'events'));}catch(e){return fail(e);}}
export async function POST(req:Request){try{const user=await authorize(req,true),p=eventSchema.safeParse(await jsonBody(req));if(!p.success)throw new ApiError(400,p.error.issues[0].message);return Response.json(await db.insert(user,'events',p.data),{status:201});}catch(e){return fail(e);}}
export async function PATCH(req:Request){try{const user=await authorize(req,true),b=await jsonBody(req),p=eventSchema.safeParse(b);if(!p.success)throw new ApiError(400,p.error.issues[0].message);return Response.json(await db.update(user,'events',b.id,b.version,p.data));}catch(e){return fail(e);}}
export async function DELETE(req:Request){try{const user=await authorize(req,true),b=await jsonBody(req);return Response.json(await db.remove(user,'events',b.id,b.version));}catch(e){return fail(e);}}
