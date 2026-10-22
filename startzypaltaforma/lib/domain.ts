import { z } from 'zod';
import { validDate } from './calendar.ts';
export const STAGES = ['Encontrada','Qualificação','Em criação','Proposta enviada','Fechada','Arquivada'] as const;
const short = z.string().max(500).default('');
const long = z.string().max(12000).default('');
const url = z.string().max(2000).refine(v => !v || /^https?:\/\//i.test(v), 'Use um endereço http ou https.').default('');
export const leadSchema = z.object({
  name: z.string().trim().min(2,'Informe o nome da empresa.').max(160),
  segment: short, city: short, state: z.string().max(2).default(''), address: short,
  contact: short, phone: short, email: z.string().max(250).refine(v=>!v||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),'E-mail inválido.').default(''),
  website: url, instagram: url, facebook: url, maps: url, source: short,
  logo: z.string().max(2000).refine(v=>!v||/^https?:\/\//i.test(v)||/^\/api\/assets\?id=[a-f0-9-]+$/.test(v),'Logo inválido.').default(''),
  colors: z.string().max(200).refine(v=>!v||v.split(',').every(c=>/^#[0-9a-fA-F]{6}$/.test(c.trim())),'Use cores em hexadecimal, separadas por vírgula.').default(''),
  materials: long, services: long, audience: long, differentials: long,
  observations: long, confirmed: long, pending: long, objective: long, pages: long,
  cta: short, demoUrl: url, offer: long, commercial: long,
  nextAction: short, followUp: z.string().refine(v=>!v||validDate(v),'Data inválida.').default(''),
  stage: z.enum(STAGES).default('Encontrada'), priority: z.enum(['Alta','Média','Baixa']).default('Média'),
  externalId: z.string().max(200).default(''),
});
export type LeadData = z.infer<typeof leadSchema>;
export type Lead = LeadData & {id:string;version:number;createdAt:string;updatedAt:string;history:{at:string;text:string}[]};
export const blankLead = ():LeadData => leadSchema.parse({name:'Nova empresa'});
export const completeness = (l:LeadData) => Math.round([l.name,l.segment,l.city,l.phone||l.email,l.website||l.instagram,l.logo,l.colors,l.services,l.objective,l.confirmed].filter(Boolean).length/10*100);
export function briefing(l:LeadData, kind:'site'|'commercial', origin='') {
  const val=(x:string)=>x||'Não informado — confirmar com a empresa.';
  const core=`EMPRESA: ${l.name}\nSegmento: ${val(l.segment)}\nCidade/UF: ${val([l.city,l.state].filter(Boolean).join(' / '))}\nEndereço: ${val(l.address)}\nContato: ${val(l.contact)}\nTelefone/WhatsApp: ${val(l.phone)}\nE-mail: ${val(l.email)}\n\nFONTES E PRESENÇA DIGITAL\nOrigem: ${val(l.source)}\nSite atual: ${val(l.website)}\nInstagram: ${val(l.instagram)}\nFacebook: ${val(l.facebook)}\nGoogle Maps: ${val(l.maps)}\n\nDADOS COLETADOS (validar antes de publicar)\nServiços: ${val(l.services)}\nPúblico: ${val(l.audience)}\nDiferenciais: ${val(l.differentials)}\nObservações da pesquisa: ${val(l.observations)}\n\nINFORMAÇÕES CONFIRMADAS PELO RESPONSÁVEL\n${val(l.confirmed)}\n\nPENDÊNCIAS E DÚVIDAS\n${val(l.pending)}`;
  if(kind==='commercial') return `BRIEFING COMERCIAL · STARTZY\n\n${core}\n\nOPORTUNIDADE\nEtapa: ${l.stage}\nNecessidade / objetivo: ${val(l.objective)}\nDemonstração: ${val(l.demoUrl)}\nOferta e condições: ${val(l.offer)}\nHistórico comercial e objeções: ${val(l.commercial)}\nPróximo passo: ${val(l.nextAction)}\nRetorno: ${val(l.followUp)}\n\nPrepare uma abordagem baseada apenas nos dados acima. Não invente interesse, preços, resultados ou compromissos. Não envie mensagens automaticamente.`;
  return `BRIEFING DE CRIAÇÃO · STARTZY\n\n${core}\n\nIDENTIDADE E MATERIAIS\nLogo: ${val(l.logo.startsWith('/')?origin+l.logo:l.logo)}${l.logo.startsWith('/')?' (arquivo privado; requer acesso à plataforma)':''}\nCores: ${val(l.colors)}\nFotos e referências: ${val(l.materials)}\n\nDIREÇÃO PROPOSTA PARA O SITE\nObjetivo: ${val(l.objective)}\nPáginas / seções: ${val(l.pages)}\nChamada para ação: ${val(l.cta)}\nDemonstração existente: ${val(l.demoUrl)}\n\nUse minha skill de criação com este contexto. Diferencie fatos confirmados de sugestões. Não invente serviços, equipe, avaliações, depoimentos, preços ou certificações. Sinalize lacunas antes de publicar. Verifique os links e a experiência no celular.`;
}
export function normalizeImport(raw:unknown):(LeadData & {history?:Lead['history']})[] {
  const root=raw as Record<string,unknown>;
  const rows=Array.isArray(raw)?raw:Array.isArray(root?.companies)?root.companies:Array.isArray(root?.leads)?root.leads:Array.isArray(root?.opportunities)?root.opportunities:null;
  if(!rows||rows.length===0||rows.length>200) throw new Error('Use uma lista JSON com 1 a 200 empresas (ou companies / leads / opportunities).');
  const aliases:Record<string,string[]>={name:['name','nome','empresa','companyName'],segment:['segment','nicho','categoria','category'],city:['city','cidade'],state:['state','uf'],address:['address','endereco','endereço'],phone:['phone','telefone','whatsapp'],email:['email'],website:['website','site','websiteUrl'],instagram:['instagram'],facebook:['facebook'],maps:['maps','mapsUrl','googleMapsUrl'],externalId:['externalId','placeId','place_id'],source:['source','origem'],observations:['observations','observacoes','observações']};
  return rows.map((row:any,i)=>{
    if(!row||typeof row!=='object') throw new Error(`Empresa ${i+1}: registro inválido.`);
    const obj:Record<string,unknown>={...row};
    for(const [dest,keys] of Object.entries(aliases)) for(const key of keys) if(row[key]!=null) {obj[dest]=String(row[key]);break;}
    if(obj.website && !/^https?:\/\//i.test(String(obj.website))) obj.website='https://'+obj.website;
    obj.source=obj.source||'Importação manual';
    const result=leadSchema.safeParse(obj);
    if(!result.success) throw new Error(`Empresa ${i+1}: ${result.error.issues.map(e=>e.path.join('.')+': '+e.message).join('; ')}`);
    const history=z.array(z.object({at:z.string().datetime(),text:z.string().max(1000)})).max(80).safeParse(row.history);
    return {...result.data,...(history.success?{history:history.data}:{})};
  });
}
