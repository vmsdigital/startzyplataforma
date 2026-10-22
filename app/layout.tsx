import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'Startzy · Sua área de trabalho',template:'%s · Startzy'},description:'Marketing e prospecção no mesmo lugar.',robots:{index:false,follow:false},icons:{icon:'/brand/startzy-symbol.png',apple:'/brand/startzy-symbol.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>;}
