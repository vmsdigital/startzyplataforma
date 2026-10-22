# Usar as ferramentas e trazer dados antigos

## Marketing

Na primeira entrada, clique em **Carregar 41 pautas**. O planejamento anterior passa a ser editável na sua conta: 7 posts, 4 carrosséis e 30 sequências de stories. O carregamento não substitui pautas que você já editou.

- **Calendário:** clique em um dia para ver o que está planejado e em uma pauta para abrir o roteiro. Em telas pequenas, o mês vira uma agenda em lista.
- **Nova pauta:** preencha título, formato, data, horário, canal e etapa da produção. Use Texto e roteiro para a legenda, slides ou telas de stories e Direção e estratégia para desenvolver a ideia.
- **Datas comemorativas:** navegue por ano, transforme uma data em pauta ou acrescente aniversários de clientes e lançamentos. A repetição anual mantém o mesmo dia e mês; não calcula datas móveis particulares.
- **Estratégia e marca:** consulte os pilares, a bio, a logo e o radar do planejamento original.
- **Exportar agenda:** gera um arquivo `.ics` das pautas com data para importar em um calendário externo. É uma cópia do momento, sem sincronização contínua.
- **Exportar / Importar:** salva e recupera pautas e datas próprias em JSON (versão 1, até 1 MB, 200 pautas e 100 datas por lote). Registros com o mesmo ID são ignorados na importação, para preservar edições existentes. Para substituir conteúdo já existente, edite a pauta pela interface.

As imagens privadas não são embutidas no JSON. Na mesma conta e projeto, os links continuam apontando para o arquivo. Se mudar de conta ou Supabase, envie as imagens novamente. A postagem no Instagram permanece manual.

O calendário distingue feriados nacionais, datas religiosas, culturais e oportunidades de campanha. Carnaval e Corpus Christi não são tratados como feriados nacionais automáticos. Confira funcionamento e regras locais quando isso importar para uma campanha. As pautas de assuntos do momento conservam o contexto de outubro de 2026; revise a validade antes de publicar.

## Prospect

1. Crie uma empresa ou importe um lote revisado.
2. Complete a ficha, contatos e fontes.
3. Em Marca e presença, registre logo, cores, canais e materiais.
4. Em Criação, reúna objetivo, páginas, chamada para ação e demonstração.
5. Em Comercial, registre a oferta, o histórico da conversa, a próxima ação e a data de retorno.
6. Altere a etapa no dossiê conforme a oportunidade avança e acompanhe os retornos na aba própria.
7. Copie ou baixe os briefings consolidados na aba Briefings.

A carteira oferece quadro e lista, busca e filtros por etapa/prioridade. A versão de um registro é conferida antes de salvar: se ele mudou em outra aba, atualize a página para evitar substituir uma edição mais recente.

## Migrar a carteira anterior

O ZIP de código da plataforma antiga não contém o banco que estava hospedado. Nada foi importado automaticamente.

1. Entre na plataforma antiga e use **Exportar** para baixar o JSON das oportunidades.
2. Guarde esse arquivo original como cópia de segurança.
3. Na nova plataforma, abra **Prospect → Importar** e carregue o arquivo ou cole o JSON.
4. Clique em revisar, confira os registros e confirme a importação.
5. Confira as etapas, retornos, materiais e briefings das empresas trazidas.

São aceitos uma lista JSON ou objetos com `companies`, `leads` ou `opportunities`, com até 200 empresas e 1 MB por lote. Nome, localização, contatos, campos do dossiê, etapa e histórico válido são preservados. Os novos registros recebem ID, versão e datas de cadastro da nova plataforma; o histórico importado permanece dentro da ficha.

Duplicações são reconhecidas pelo ID externo, quando existe, ou por empresa + cidade + UF. Elas são ignoradas, sem sobrescrever a ficha já cadastrada. Não é uma sincronização entre as duas plataformas.

Logos guardados no armazenamento privado antigo não são transferidos pelo JSON. Reenvie esses arquivos em **Marca e presença**. Links de imagens externas continuam dependendo do endereço original.

Os dados ficam separados por conta de login. Use a mesma conta nos seus dispositivos para acessar a mesma carteira e o mesmo planejamento.
