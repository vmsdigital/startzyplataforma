import {configured,safeReturn,session} from '@/lib/auth';
import {redirect} from 'next/navigation';
import Login from '@/components/login';
export const metadata={title:'Entrar'};
export default async function Page({searchParams}:{searchParams:Promise<{retorno?:string}>}){const params=await searchParams;if(await session())redirect(safeReturn(params.retorno));return <Login ready={configured()} retorno={safeReturn(params.retorno)}/>;}
