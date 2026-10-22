# Verificação — Startzy Sistemas v2

Conferido em 22/10/2026.

- Compilação de produção Next.js 16.4.2 concluída, incluindo a nova entrada `/`.
- 8 testes de regras aprovados, incluindo recusa de chaves administrativas na configuração.
- 44 verificações de integração local aprovadas: dados de Marketing e Prospect, importação, arquivos privados, conflitos de edição, bloqueio de origem externa, proteção sem sessão, entrada, atalhos e recursos de marca.
- Conferência no navegador: a raiz da aplicação separada chegou a `/entrar?retorno=%2Fapp`; o link de retorno aponta para o site comercial.

O domínio enviado pelo usuário também foi conferido no navegador. A home de `https://startzyplataforma.vercel.app/` mostrava o site comercial, enquanto `/entrar` e `/app` retornavam 404. O deploy remoto não foi alterado por esta entrega.

O banco Supabase remoto não foi modificado, e nenhum usuário ou senha foi criado. Não foram utilizadas as chaves de API fornecidas. A configuração real depende da execução do SQL, do cadastro do usuário e das variáveis na sua conta, conforme COMECE-AQUI.md.

Os testes de dados utilizaram somente a prévia isolada no computador. Registros e arquivos dessa prévia não estão no ZIP. O pacote não contém chaves reais nem senhas.
