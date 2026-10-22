# Startzy — site e plataformas

Um único projeto para o site público, o Startzy Marketing e o Startzy Prospect, preparado para GitHub + Vercel.

| Endereço | O que abre |
| --- | --- |
| `/` | Site público original v10, com as páginas de serviços, projetos, contato e sobre |
| `/entrar` | Acesso à área privada |
| `/app` | Visão geral das ferramentas |
| `/app/marketing` | Calendário, pautas, datas comemorativas e estratégia |
| `/app/prospect` | Empresas, retornos, dossiês e briefings |

A identidade usa Geist, fundo `#09090b`, azul `#4269df`, periwinkle `#9db7ff` e o símbolo S da Startzy. O site tem um link discreto para a Área Startzy no rodapé.

## Publicar

Leia **[PUBLICAR-NA-VERCEL.md](docs/PUBLICAR-NA-VERCEL.md)**. O projeto precisa de uma conta Supabase para login, banco e imagens privadas. O código já está integrado; as credenciais do seu próprio projeto devem ser configuradas na Vercel.

**Nenhuma conta externa foi criada, nenhum dado da plataforma antiga foi transferido e nenhum deploy foi realizado.** O site público funciona sem configurar o banco. Sem as variáveis de acesso, a área interna fica fechada.

## Prévia no computador

Use Node.js 22.14 ou superior da linha 22 e npm. Dentro da pasta que contém este arquivo:

```sh
npm ci
npm run dev:demo
```

Abra `http://127.0.0.1:3011/app`. A prévia local permite usar as ferramentas sem conta externa e guarda os testes em `.local/`. Ela só funciona em desenvolvimento, com hostname local, e não é habilitada em produção. A pasta `.local` não deve ser enviada ao GitHub nem à Vercel.

Para desenvolvimento com o banco real, copie `.env.example` para `.env.local`, preencha os dados do seu Supabase e use `npm run dev`. Nesse modo, abra `/entrar`.

## O que está incluído

- **Marketing:** calendário mensal e agenda para telas pequenas, horários, canal, status de produção, edição de textos e roteiros, slides de carrossel, telas de stories, imagem da pauta, datas próprias com repetição anual, exportação e importação JSON, agenda `.ics` e a estratégia da marca.
- **Planejamento anterior:** 7 posts, 4 carrosséis e 30 sequências de stories. O botão **Carregar 41 pautas** adiciona o plano uma vez e preserva alterações existentes. As datas originais são de outubro/novembro de 2026 e podem ser remarcadas.
- **Prospect:** quadro e lista, pesquisa e filtros, fichas de empresas, marca e materiais, etapas comerciais, retornos, histórico, briefings de criação/comercial, logo privado, importação manual revisada e exportação JSON.
- **Site:** os 28 HTMLs da versão v10, imagens, fontes, sitemap e robots. O único acréscimo visual no site público é o acesso à Área Startzy no rodapé.

O calendário ajuda a planejar. O sistema não publica no Instagram e não envia mensagens para prospectados. A importação da futura extensão continua sendo manual e revisada nesta versão.

## Dados e acesso

Login por e-mail/senha do Supabase, lista de e-mails autorizados no servidor e políticas de banco por usuário. Cada conta tem sua própria carteira e planejamento. Os arquivos de clientes ficam em um bucket privado. Para trabalho compartilhado entre vários usuários seria necessário acrescentar organizações/equipes; esta entrega conserva o modelo privado individual.

O código-fonte não contém senhas, chave administrativa nem o banco da plataforma anterior. Não envie `.env.local`, `.local/`, `node_modules/` ou `.next/` para o repositório.

O acesso antigo dependia da hospedagem Cloudflare/Sites. Ele foi substituído para esta versão funcionar na Vercel. A plataforma antiga continua separada até você exportar e importar os dados. Veja **[USAR-E-MIGRAR.md](docs/USAR-E-MIGRAR.md)**.

## Estrutura

```text
app/          Páginas privadas e APIs Next.js
components/   Interface das plataformas
lib/          Validação, autenticação, dados e calendário
public/       Site público v10, imagens e fontes
data/         Planejamento inicial do Marketing
supabase/     SQL de configuração do banco e arquivos privados
docs/         Publicação, uso e verificação
tests/        Testes das regras de dados e calendário
```

Para editar o site, altere `public/index.html` e os demais HTMLs/arquivos de estilo em `public/`. Para editar o visual das plataformas, use `app/globals.css` e `components/`.

## Verificação

```sh
npm run check
npm test
npm run build
```

O roteiro de integração local está em `scripts/verify-local.mjs`. Ele exige a prévia local em 3011 e uma compilação de produção em 3012; cria e remove somente seus próprios registros de teste. O resultado da conferência desta entrega está em [VERIFICACAO.md](docs/VERIFICACAO.md).
