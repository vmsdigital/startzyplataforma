import Prospect from '@/components/prospect';
import {requireSession} from '@/lib/auth';
export const metadata={title:'Prospect'};
export default async function Page(){const user=await requireSession();return <Prospect displayName={user.name}/>;}
