export type CalendarDate = { id:string; title:string; date:string; category:string; notes:string; builtin?:boolean; repeat?:boolean; version?:number };
export const todaySP = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function validDate(value:string) { if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T12:00:00Z');return !isNaN(d.getTime())&&d.toISOString().slice(0,10)===value; }
export const iso = (d:Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const prettyDate = (value:string) => value ? new Date(value+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}) : 'Sem data';
export function easter(year:number) {
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
  return new Date(year,Math.floor((h+l-7*m+114)/31)-1,(h+l-7*m+114)%31+1,12);
}
function nthSunday(y:number,m:number,n:number){const d=new Date(y,m-1,1,12);d.setDate(1+(7-d.getDay())%7+7*(n-1));return iso(d);}
export function calendarDates(year:number):CalendarDate[]{
 const make=(id:string,title:string,date:string,category:string,notes:string):CalendarDate=>({id:'builtin-'+id,title,date,category,notes,builtin:true});
 const fixed:[string,string,string,string][]=[
  ['01-01','Ano-Novo','Feriado nacional','Planejar os primeiros passos do ano e mostrar a direção da marca.'],
  ['03-08','Dia Internacional da Mulher','Comemorativa','Dar espaço a histórias e iniciativas reais, com respeito ao contexto.'],
  ['03-15','Dia do Consumidor','Comemorativa','Explicar oferta, experiência e dúvidas de compra.'],
  ['04-21','Tiradentes','Feriado nacional','Planejar o calendário e a comunicação de funcionamento.'],
  ['05-01','Dia do Trabalho','Feriado nacional','Mostrar pessoas, rotina e o trabalho por trás das entregas.'],
  ['06-12','Dia dos Namorados','Comemorativa','Avaliar se existe uma associação útil ao público antes de criar campanha.'],
  ['08-11','Dia da Advocacia','Comemorativa','Mostrar um projeto ou aprendizado sobre apresentação de serviços jurídicos.'],
  ['09-07','Independência do Brasil','Feriado nacional','Planejar funcionamento e conteúdo com contexto.'],
  ['09-15','Dia do Cliente','Comemorativa','Ouvir clientes e mostrar relatos reais, quando autorizados.'],
  ['10-05','Dia da Micro e Pequena Empresa','Comemorativa','Conversar sobre decisões práticas de quem empreende.'],
  ['10-12','Nossa Senhora Aparecida / Dia das Crianças','Feriado nacional','Separar a comunicação de funcionamento da pauta comemorativa.'],
  ['10-25','Dia Nacional da Saúde Bucal / Dentista','Comemorativa','Uma oportunidade para explicar um projeto de clínica, sem alegar resultados não medidos.'],
  ['10-31','Halloween','Cultural','Usar humor ou uma comparação somente se combinar com a voz da marca.'],
  ['11-02','Finados','Feriado nacional','Planejar funcionamento; tratar o contexto com cuidado.'],
  ['11-05','Dia do Design','Comemorativa','Mostrar uma decisão de design e a razão por trás dela.'],
  ['11-15','Proclamação da República','Feriado nacional','Planejar o mês e a comunicação de funcionamento.'],
  ['11-20','Dia Nacional de Zumbi e da Consciência Negra','Feriado nacional','Dar contexto e visibilidade a iniciativas e compromissos que existam de fato.'],
  ['12-25','Natal','Feriado nacional','Planejar comunicação, agradecimentos e atendimento de fim de ano.'],
  ['12-31','Retrospectiva do ano','Planejamento','Reunir trabalhos, aprendizados e próximos passos com dados reais.'],
 ];
 const rows=fixed.map(([md,title,c,n])=>make(md,title,`${year}-${md}`,c,n));
 const pascoa=easter(year);const shifted=(days:number)=>{const x=new Date(pascoa);x.setDate(x.getDate()+days);return iso(x);};
 rows.push(make('carnaval','Carnaval',shifted(-47),'Cultural','Planejar o atendimento e verificar o calendário local de funcionamento.'));
 rows.push(make('paixao','Sexta-feira da Paixão',shifted(-2),'Religiosa','Planejar a comunicação de funcionamento conforme o calendário local.'));
 rows.push(make('pascoa','Páscoa',iso(pascoa),'Religiosa','Considerar o público e o contexto antes de associar uma oferta.'));
 rows.push(make('corpus','Corpus Christi',shifted(60),'Religiosa','Conferir o funcionamento local ao organizar campanhas.'));
 rows.push(make('maes','Dia das Mães',nthSunday(year,5,2),'Comemorativa','Planejar uma mensagem ou oferta que faça sentido para o público.'));
 rows.push(make('pais','Dia dos Pais',nthSunday(year,8,2),'Comemorativa','Planejar a pauta a partir de uma história ou necessidade real.'));
 const thanksgiving=new Date(year,10,1,12);thanksgiving.setDate(1+(4-thanksgiving.getDay()+7)%7+21);thanksgiving.setDate(thanksgiving.getDate()+1);
 rows.push(make('black-friday','Black Friday',iso(thanksgiving),'Campanha','Organizar público, entrega, condições e caminho de contato antes do preço.'));
 const programmer=new Date(year,0,256,12);rows.push(make('programador','Dia da Programação',iso(programmer),'Comemorativa','Mostrar uma melhoria que a tecnologia tornou possível.'));
 if(year===2026)rows.push(make('eleicao2026','Segundo turno das eleições', '2026-10-25','Contexto de 2026','Pauta de escolha do planejamento original. Revisar o contexto e a validade antes de publicar.'));
 return rows.sort((a,b)=>a.date.localeCompare(b.date));
}
export function monthCells(year:number,month:number){const first=new Date(year,month,1,12);const start=new Date(first);start.setDate(1-first.getDay());return Array.from({length:42},(_,i)=>{const day=new Date(start);day.setDate(start.getDate()+i);return {date:iso(day),day:day.getDate(),current:day.getMonth()===month};});}
export function exportICS(items:{id:string;title:string;date:string;time?:string;caption?:string}[]){const esc=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/[,;]/g,'\\$&');const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Startzy//Marketing//PT-BR','CALSCALE:GREGORIAN',...items.filter(x=>validDate(x.date)).flatMap(x=>['BEGIN:VEVENT','UID:'+esc(x.id)+'@startzy','DTSTAMP:'+stamp,'DTSTART;TZID=America/Sao_Paulo:'+x.date.replace(/-/g,'')+'T'+(x.time||'09:00').replace(':','')+'00','DURATION:PT30M','SUMMARY:'+esc(x.title),'DESCRIPTION:'+esc((x.caption||'').slice(0,5000)),'END:VEVENT']),'END:VCALENDAR'].join('\r\n');}
