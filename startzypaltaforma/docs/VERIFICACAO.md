# Conferência desta entrega

Data: 21/10/2026. Ambiente local Windows, Node.js 22.14, Next.js 16.4.2.

## Resultado

- Compilação de produção concluída, incluindo o Proxy e todas as páginas/APIs internas.
- TypeScript sem erros.
- 6 testes de regras aprovados: datas móveis, ano bissexto, datas impossíveis, importação e histórico, briefings privados, exportação de agenda e validação de backup.
- 39 verificações de integração local aprovadas.
- 28 páginas HTML públicas conferidas; nenhum arquivo local referenciado por HTML ou CSS ausente.
- Interface conferida no navegador: painel, carregamento das 41 pautas, criação/salvamento de pauta, datas comemorativas, navegação do Prospect, edição de dossiê e briefing consolidado.

## Integração verificada

Cadastro/edição de empresas, duplicação, conflito entre versões, retorno inválido, recusa de origem externa, importação com nomes de campos antigos, preservação do histórico, carregamento repetido sem duplicar as pautas, edição de status, datas próprias, restauração de Marketing, arquivos PNG privados e recusa de imagem falsa.

O servidor de produção local foi iniciado inclusive com a variável de prévia local definida. O acesso privado continuou bloqueado sem login, as APIs responderam 401 e os cabeçalhos de identidade da antiga hospedagem não concederam acesso. As páginas públicas permaneceram acessíveis.

Os registros criados pelos testes foram removidos. Os dados usados na prévia local não estão no ZIP.

## O que depende da sua publicação

Não foram criados projeto Supabase, usuários, repositório nem deploy na Vercel. O SQL foi preparado e revisado, mas não executado em um Supabase real. Login e persistência entre dispositivos precisam da configuração e da conferência descritas no guia de publicação.

O ZIP original do Prospect trazia código, sem a base hospedada. A importação funciona; a migração da sua carteira real depende da exportação dessa versão anterior. Logos privados precisam ser enviados novamente.

## Referências do calendário

As datas móveis são calculadas por ano. A classificação diferencia oportunidades editoriais de feriados nacionais, religiosos e culturais. Fontes consultadas para contextualizar 2026:

- [Calendário administrativo do Senado](https://adm.senado.gov.br/normas/ui/pub/normaConsultada?2=&idNorma=14384729)
- [Calendário de 2026 da Prefeitura de São Paulo](https://prefeitura.sp.gov.br/web/gestao/w/calendario_2026)

Os calendários administrativos e locais não transformam pontos facultativos em feriados nacionais. A ferramenta permite acrescentar as datas do seu funcionamento e das cidades dos seus clientes.
