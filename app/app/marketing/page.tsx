import Marketing from '@/components/marketing';
import plan from '@/data/marketing-plan.json';
export const metadata={title:'Marketing'};
export default function Page(){return <Marketing strategy={{profile:plan.profile,editorial:plan.editorial,radar:plan.radar,hookBank:plan.hookBank}}/>;}
