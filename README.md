# Startzy Sistemas — aplicação separada

Versão 2, preparada para o repositório e projeto Vercel exclusivos de **sistemas.startzy.com.br**. Contém Marketing, Prospect e acesso privado. O site comercial continua separado em `https://www.startzy.com.br`.

## Acessos

| Função | Link atual da Vercel, depois do deploy correto |
| --- | --- |
| Entrada | https://startzyplataforma.vercel.app/ |
| Login | https://startzyplataforma.vercel.app/entrar |
| Visão geral | https://startzyplataforma.vercel.app/app |
| Marketing | https://startzyplataforma.vercel.app/app/marketing |
| Prospect | https://startzyplataforma.vercel.app/app/prospect |

A página inicial encaminha para a área de trabalho; sem sessão, o aplicativo abre o login. Os atalhos `/marketing`, `/prospect` e `/login` também encaminham para as páginas correspondentes. Os links “Ver site” abrem o domínio comercial.

**Siga [COMECE-AQUI.md](COMECE-AQUI.md)** para corrigir a publicação atual e ativar banco e login.

Na conferência de 22/10/2026, a home do endereço enviado abria o site público, enquanto `/entrar` e `/app` retornavam 404. Esse erro ocorre antes de qualquer acesso ao banco. Esta versão entrega o projeto Next.js completo para a aplicação separada.

## O que está pronto no código

Marketing com calendário, datas comemorativas, pautas editáveis, roteiros, imagens privadas, 41 conteúdos iniciais e exportação/importação. Prospect com empresas, dossiês, filtros, etapas, retornos, histórico, importação e briefings. Login de e-mail/senha com Supabase, lista de contas autorizadas e isolamento dos dados por usuário.

O SQL em `supabase/setup.sql` configura as coleções de Marketing e Prospect no mesmo banco e o armazenamento privado de imagens. O aplicativo usa uma Publishable key ou uma `anon` legada válida; chaves `service_role` e `sb_secret_` são recusadas na configuração.

Não há chaves reais, senhas ou dados de clientes no pacote. A URL pública do projeto Supabase foi preenchida em `.env.example`. O banco remoto, o usuário de login, as variáveis da Vercel e o DNS ainda precisam ser ativados na sua conta. Nenhuma alteração foi feita nesses serviços por esta entrega.

## Desenvolvimento

Node.js 22.14+ da linha 22 e npm:

```sh
npm ci
npm run dev:demo
```

Prévia em `http://127.0.0.1:3011`. Os testes dessa prévia ficam em `.local/`, fora do Git. O modo de prévia local não funciona em produção.

Para usar seu Supabase em desenvolvimento, copie `.env.example` para `.env.local`, preencha os valores e execute `npm run dev`. Não envie `.env.local` ao repositório.

```sh
npm test
npm run check
npm run build
```

As dependências são instaladas com `npm ci`. O arquivo de lock acompanha o projeto. Não use `public/` como Output Directory na Vercel.
