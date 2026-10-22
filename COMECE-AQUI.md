# Ativar Startzy Marketing e Prospect

Você precisa concluir três partes: publicar a aplicação Next.js, executar o SQL do Supabase e criar seu usuário. As chaves de API não criam tabelas nem uma conta de login por conta própria.

## 1. Corrigir o deploy que está mostrando o site

No repositório exclusivo da plataforma, use o conteúdo da pasta **startzy-sistemas** deste ZIP. A raiz precisa ficar assim:

```text
package.json
package-lock.json
next.config.mjs
proxy.ts
app/
components/
lib/
data/
public/
supabase/
```

O arquivo `package.json` precisa estar na raiz selecionada na Vercel. Se ele estiver dentro de uma subpasta, selecione essa subpasta como Root Directory. Não escolha a pasta `public`.

No projeto **startzyplataforma** da Vercel, confira Settings → Build and Deployment:

| Configuração | Valor |
| --- | --- |
| Framework Preset | **Next.js** |
| Root Directory | Pasta que contém `package.json` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Padrão automático do Next.js, sem override `public` |
| Node.js Version | 22.x |

Uma publicação apenas de arquivos estáticos pode mostrar a home e retornar 404 em `/entrar` e `/app`. Configurar o banco não corrige esse tipo de 404; as páginas da aplicação precisam ser incluídas no build.

## 2. Criar a estrutura de dados

1. Entre no seu projeto Supabase. A URL identificada na chave pública enviada foi `https://iktqojlusnwdduisbqpi.supabase.co`; confira se é o projeto que você quer usar.
2. Abra **SQL Editor → New query**.
3. Copie todo o conteúdo de **[supabase/setup.sql](supabase/setup.sql)** e execute uma vez.
4. Confirme que a execução terminou sem erros e que a tabela `startzy_records` foi criada.

O mesmo banco serve às duas plataformas. A tabela organiza registros nas coleções `marketing` (pautas), `events` (datas próprias), `leads` (empresas) e `imports` (histórico de importações). Cada registro pertence a um usuário; as políticas RLS mantêm esse isolamento.

O script também cria o bucket privado `startzy-assets` para logos e artes PNG/JPG/WebP de até 4 MB. Ele não apaga as fichas existentes e pode ser executado novamente para configurar as políticas da aplicação. Execute-o no projeto destinado à Startzy.

## 3. Criar seu login

1. Em **Authentication → Users**, use **Add user → Create new user**.
2. Cadastre o e-mail que você vai usar. O exemplo do aplicativo está configurado para `agenciastartzy@gmail.com`.
3. Defina a senha diretamente no painel do Supabase. Não é necessário enviar sua senha no chat.
4. Conclua a confirmação do usuário no painel, para permitir o login por senha.
5. Nas configurações do provedor de e-mail, mantenha esse provedor habilitado e desative o cadastro público de novos usuários.

O usuário criado deve ter o mesmo e-mail cadastrado em `STARTZY_ALLOWED_EMAILS` na etapa seguinte. A chave de API e a senha do banco não são sua senha de login.

## 4. Adicionar as variáveis na Vercel

Em **Settings → Environment Variables**, crie as três variáveis para o ambiente **Production**:

| Nome | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://iktqojlusnwdduisbqpi.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sua **Publishable key** atual do Supabase, que começa com `sb_publishable_`; uma `anon` legada válida também é aceita |
| `STARTZY_ALLOWED_EMAILS` | `agenciastartzy@gmail.com`, ou exatamente o e-mail criado no Auth |

Copie a chave pública de **Settings → API Keys** do seu Supabase. O código não precisa de chave administrativa. Não crie uma variável `service_role` e não cole uma chave administrativa no campo de chave pública.

Depois de salvar o código e as variáveis, faça um **novo deploy**. Mudar uma variável sem refazer o deploy não atualiza a versão já publicada.

## 5. Abrir a plataforma

1. Abra **https://startzyplataforma.vercel.app/entrar**.
2. Entre com o e-mail e a senha do usuário criado no Supabase.
3. No Marketing, clique em **Carregar 41 pautas** para adicionar o planejamento anterior à sua conta.
4. Edite uma pauta e recarregue para conferir que ficou salva.
5. No Prospect, crie uma ficha de teste e confira o salvamento e o upload de um logo.
6. Use a mesma conta em outro dispositivo para acessar os mesmos dados.

Cada usuário autorizado tem dados individuais. As ferramentas não compartilham uma carteira entre contas diferentes nesta versão.

## 6. Conectar o subdomínio

1. No mesmo projeto Vercel da plataforma, abra **Settings → Domains**.
2. Adicione **sistemas.startzy.com.br**.
3. No painel DNS do domínio, crie o registro solicitado pela Vercel. Use o nome `sistemas` e o valor exato que o painel mostrar, pois a indicação pode ser específica do projeto.
4. Aguarde a confirmação do domínio e do HTTPS no painel.
5. No Supabase, em **Authentication → URL Configuration**, defina a Site URL definitiva como `https://sistemas.startzy.com.br`.

Depois disso, os acessos serão:

- `https://sistemas.startzy.com.br/entrar`
- `https://sistemas.startzy.com.br/app/marketing`
- `https://sistemas.startzy.com.br/app/prospect`

O site comercial permanece em `www.startzy.com.br`, no seu próprio repositório/projeto.

## Se aparecer erro

| O que aparece | O que conferir |
| --- | --- |
| 404 em `/entrar` ou `/app` | Código completo, framework Next.js, Root Directory e Output Directory |
| Acesso em preparação | As três variáveis, chave pública válida e novo deploy |
| E-mail/senha recusados | Usuário no Auth, confirmação, senha e e-mail na lista autorizada |
| Entrou, mas não salva | Execução do SQL, tabela, políticas e projeto Supabase correto |
| Não envia imagem | Bucket privado e políticas; PNG/JPG/WebP até 4 MB |

## Chave administrativa enviada no chat

A `service_role` enviada é uma chave legada com privilégio administrativo. Ela não foi incluída nem usada neste pacote. No painel do Supabase, migre os aplicativos que ainda usam as chaves legadas para a Publishable key atual e desative/substitua as credenciais legadas expostas, seguindo o fluxo do painel. Criar uma chave nova, sozinho, não invalida as antigas. Se alterar a `anon` usada na Vercel, atualize a variável e faça novo deploy.

Referências: [chaves e privilégios do Supabase](https://supabase.com/docs/guides/getting-started/api-keys), [Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).
