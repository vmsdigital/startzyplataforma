# Publicar a Startzy no GitHub e na Vercel

Você publica **um único repositório e um único projeto Vercel**. O site abre no domínio principal e as ferramentas ficam em `/app/marketing` e `/app/prospect`.

## 1. Preparar o Supabase

1. Crie um projeto na sua própria conta Supabase e guarde a senha do banco no seu gerenciador de senhas.
2. Abra o **SQL Editor**, copie o conteúdo de `supabase/setup.sql` e execute. Ele cria a tabela `startzy_records`, as políticas por usuário e o bucket privado `startzy-assets`.
3. Na configuração de autenticação, mantenha o provedor de e-mail habilitado e desative o cadastro público de novos usuários.
4. Em **Authentication → Users**, crie seu usuário com e-mail e senha. Conclua a confirmação desse usuário no painel conforme o fluxo disponibilizado pela sua conta. Não use a senha do banco para entrar no aplicativo.
5. Nas configurações de API do projeto, copie a **Project URL** e a **Publishable key**. O aplicativo não precisa de `service_role`, secret key nem da senha do banco.
6. Em URL Configuration da autenticação, defina a Site URL com o domínio que você vai usar. Este aplicativo usa login por senha; não depende de OAuth ou login por link de e-mail.

O SQL deve terminar sem erros. Confirme que o bucket está marcado como privado. Cada registro contém o ID do usuário e as políticas permitem ler/alterar apenas os próprios dados.

## 2. Enviar ao GitHub

1. Extraia o ZIP.
2. Crie um repositório na sua conta e envie o conteúdo da pasta **startzy-suite**.
3. A raiz do repositório precisa conter `package.json`, `package-lock.json`, `next.config.mjs`, `app/`, `public/` e `supabase/`.
4. Preserve `.gitignore`. Não inclua arquivos `.env.local`, `.local/`, `.next/`, `.npm-cache/` ou `node_modules/`.

O nome do repositório é livre. Um repositório privado ajuda a manter o código e o planejamento editorial acessíveis apenas a quem você autorizar.

## 3. Importar na Vercel

1. Crie um projeto Vercel importando esse repositório.
2. Escolha **Next.js** como framework e Node.js **22.x**.
3. Root Directory: a pasta que contém `package.json`. Se você subiu diretamente o conteúdo de `startzy-suite`, é a raiz do repositório.
4. Install Command: `npm ci`. Build Command: `npm run build`. Deixe Output Directory no padrão do Next.js; não selecione `public/` como saída.
5. Cadastre as três variáveis abaixo em **Environment Variables**. Use os valores do seu projeto, sem aspas extras.

| Variável | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do Supabase, por exemplo `https://seu-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key do mesmo projeto |
| `STARTZY_ALLOWED_EMAILS` | Seu e-mail de login; o exemplo usa `agenciastartzy@gmail.com` |

Para mais de uma conta, separe os e-mails por vírgula. As contas terão dados individuais, sem carteira compartilhada. A chave publicável foi feita para ser usada pelo aplicativo; o controle dos dados depende das políticas SQL e da autenticação.

**Não adicione `STARTZY_LOCAL_DEMO` à Vercel.** Esse recurso é apenas para prévia local e é recusado em modo de produção mesmo que a variável seja definida.

6. Faça o deploy. Depois de alterar variáveis, faça um novo deploy para que o aplicativo use os novos valores.
7. Em Domains, conecte `www.startzy.com.br` ou o domínio desejado e siga os registros DNS indicados pela Vercel. O site v10 contém canonicals e sitemap para `https://www.startzy.com.br`; se usar outro endereço definitivo, ajuste também esses arquivos em `public/`.

## 4. Conferir depois do deploy

1. Abra `/`: o site precisa aparecer com suas imagens e páginas públicas.
2. Abra `/app` em uma janela sem sessão: deve ser direcionado a `/entrar`.
3. Entre com o usuário criado no Supabase e cadastrado em `STARTZY_ALLOWED_EMAILS`.
4. No Marketing, use **Carregar 41 pautas**. Edite uma pauta, salve e recarregue.
5. No Prospect, cadastre uma empresa de teste, envie um logo, salve, recarregue e abra o briefing.
6. Entre em outro dispositivo com a mesma conta para conferir os dados sincronizados.
7. Saia da conta e confirme que fichas e arquivos privados não abrem sem login.

A validação com o seu Supabase real precisa ocorrer nesta etapa: a entrega foi testada localmente e não tem acesso às credenciais ou à infraestrutura que você vai criar.

## Se algo não abrir

| Sintoma | Conferência |
| --- | --- |
| Login informa que o acesso não está configurado | Preencher as três variáveis e refazer o deploy |
| E-mail/senha recusados | Conferir usuário, senha, confirmação e lista de e-mails autorizados |
| Login funciona, mas as ferramentas não salvam | Conferir a execução completa do SQL e as políticas RLS |
| Imagem não é enviada | Conferir bucket privado, políticas de Storage e formato PNG/JPG/WebP até 4 MB |
| Site mostra erro 404 na raiz | Conferir framework Next.js, raiz do projeto e `next.config.mjs` |
| Arquivos antigos privados não abrem | Reenviar os logos/imagens após a migração |

## Referências da implementação

- [Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Autenticação de servidor com Supabase](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- [Rewrites no Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
- [Proxy no Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

O envio de imagens foi limitado a 4 MB para respeitar a margem de payload das funções. Referência: [Limites das funções Vercel](https://vercel.com/docs/functions/limitations#request-body-size).
