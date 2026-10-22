import plan from '@/data/marketing-plan.json';
import { authorize,fail } from '@/lib/server';
import { seed } from '@/lib/store';
export async function POST(req:Request){try{const user=await authorize(req,true);const records=[...plan.posts.map(x=>({...x,kind:'post'})),...plan.carousels.map(x=>({...x,kind:'carousel'})),...plan.stories.map(x=>({...x,kind:'story'}))].map(x=>{const day=plan.calendar.find(c=>c.day===x.day);return {...x,code:x.id,date:day?.date.split('/').reverse().join('-')||'',time:'09:00',channel:'Instagram',status:'Roteiro pronto',notes:'',caption:'caption' in x?x.caption:''};});return Response.json(await seed(user,records));}catch(e){return fail(e);}}
