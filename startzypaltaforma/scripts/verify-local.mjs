// Integration checks for the isolated local demo only. Never points at production.
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:3011', production = 'http://127.0.0.1:3012';
const html = await (await fetch(base + '/app')).text();
assert.ok(html.includes('Prévia local'), 'Start the local demo on port 3011 first.');
let checks = 0;
async function call(path, method = 'GET', body, expected = 200, extra = {}) {
  const r = await fetch(base + path, { method, headers: { Origin: base, ...(body ? { 'Content-Type': 'application/json' } : {}), ...extra }, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json(); assert.equal(r.status, expected, `${method} ${path}: ${JSON.stringify(data)}`); checks++; return data;
}
const unique = crypto.randomUUID().slice(0,8);
const lead = await call('/api/opportunities','POST',{ name:'Verificação local '+unique, city:'Mauá', state:'SP', objective:'Verificar cadastro e retornos', followUp:'2026-10-25' },201);
await call('/api/opportunities','POST',{name:lead.name,city:lead.city,state:lead.state},409);
await call('/api/opportunities','POST',{name:'Data impossível',followUp:'2026-02-30'},400);
const updated = await call('/api/opportunities','PATCH',{...lead,stage:'Qualificação',nextAction:'Revisar briefing'});
assert.equal(updated.version,2); assert.match(updated.history.at(-1).text,/Qualificação/);
await call('/api/opportunities','PATCH',lead,409);
await call('/api/opportunities','PATCH',updated,403,{Origin:'https://outra-origem.example'});
const imported = await call('/api/import','POST',{companies:[{nome:'Importação local '+unique,cidade:'Santo André',uf:'SP',site:'example.com',history:[{at:'2026-10-21T12:00:00.000Z',text:'Histórico anterior'}]}]});
assert.equal(imported.created,1);
const again = await call('/api/import','POST',{companies:[{nome:'Importação local '+unique,cidade:'Santo André',uf:'SP'}]}); assert.equal(again.skipped,1);
const all = await call('/api/opportunities');const migrated=all.find(x=>x.name==='Importação local '+unique);assert.equal(migrated.history[0].text,'Histórico anterior');
const seeded = await call('/api/marketing/seed','POST',{});
const posts = await call('/api/marketing');assert.ok(posts.length>=41);assert.ok(posts.some(x=>x.code==='P01'));
assert.equal((await call('/api/marketing/seed','POST',{})).created,0);
const post=await call('/api/marketing','POST',{title:'Teste de pauta '+unique,date:'2026-11-05',time:'14:30'},201);
const changed=await call('/api/marketing','PATCH',{...post,status:'Agendado',notes:'Verificação de persistência'}); assert.equal(changed.version,2);
await call('/api/marketing','PATCH',post,409);
const event=await call('/api/events','POST',{title:'Data local '+unique,date:'2026-11-01',repeat:true},201);
const revised=await call('/api/events','PATCH',{...event,notes:'Repetir a cada ano'}); assert.equal(revised.repeat,true);
await call('/api/events','POST',{title:'Inválida',date:'2026-02-30'},400);
const backup={schemaVersion:1,items:[{...changed,id:'import-'+unique}],events:[]};
assert.equal((await call('/api/marketing/import','POST',backup)).created,1);
assert.equal((await call('/api/marketing/import','POST',backup)).skipped,1);
const restored=(await call('/api/marketing')).find(x=>x.id==='import-'+unique);assert.equal(restored.notes,'Verificação de persistência');
const badImage=await fetch(base+'/api/assets',{method:'POST',headers:{Origin:base,'Content-Type':'image/png'},body:'not an image'});assert.equal(badImage.status,400);checks++;
const fs=await import('node:fs/promises');
const image=await fs.readFile('public/brand/startzy-symbol.png');
const upload=await fetch(base+'/api/assets',{method:'POST',headers:{Origin:base,'Content-Type':'image/png'},body:image});assert.equal(upload.status,201);const asset=await upload.json();
const imageResponse=await fetch(base+asset.url);assert.equal(imageResponse.status,200);assert.equal(imageResponse.headers.get('content-type'),'image/png');checks+=2;
for(const row of [updated,migrated]) await call('/api/opportunities','DELETE',{id:row.id,version:row.version});
for(const row of [changed,restored]) await call('/api/marketing','DELETE',{id:row.id,version:row.version});
await call('/api/events','DELETE',{id:revised.id,version:revised.version});
// A production-mode server must not honor the local-demo bypass or Sites headers.
const locked=await fetch(production+'/app',{redirect:'manual',headers:{'oai-authenticated-user-id':'fake','oai-authenticated-user-email':'agenciastartzy@gmail.com'}});assert.equal(locked.status,307);assert.match(locked.headers.get('location'),/\/entrar/);checks++;
for(const path of ['/api/opportunities','/api/marketing','/api/events','/api/assets?id=12345678-abcd-4000-8000-123456789012']){const r=await fetch(production+path);assert.equal(r.status,401);checks++;}
for(const path of ['/','/contato.html','/sobre.html','/robots.txt','/sitemap.xml']){const r=await fetch(production+path);assert.equal(r.status,200,path);checks++;}
console.log(`${checks} verificações de integração aprovadas; registros de teste removidos.`);
