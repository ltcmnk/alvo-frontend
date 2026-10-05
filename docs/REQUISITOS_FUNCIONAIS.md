# Alvo — Requisitos funcionais

Derivados dos itens **Must** da priorização MoSCoW. A coluna **Sprint 1** indica o que já está
entregue nesta semana.

Legenda: ✅ entregue · 🟡 parcial (base pronta, complemento previsto) · ⏳ próximas sprints

## Usuário e acesso

| ID | Requisito | Sprint 1 | Observação |
| --- | --- | --- | --- |
| RF01 | O sistema deve permitir login com conta Google via OAuth. | ⏳ | OAuth real fora do escopo da Semana 1 |
| RF02 | O sistema deve permitir cadastrar o usuário a partir do primeiro login. | ⏳ | |
| RF03 | O usuário deve poder visualizar seus dados de perfil. | ⏳ | |
| RF04 | O usuário deve poder editar seus dados de perfil. | ⏳ | |
| RF05 | O usuário deve poder excluir sua conta e todos os seus dados (LGPD). | ⏳ | |

## Currículos

| ID | Requisito | Sprint 1 | Observação |
| --- | --- | --- | --- |
| RF06 | O usuário deve poder visualizar a lista dos seus currículos, com tipo, pontuação e data. | ✅ | `GET /api/curriculos` · página `/curriculos` |
| RF07 | O usuário deve poder visualizar um currículo específico. | 🟡 | `GET /api/curriculos/:id` pronto; tela de detalhe na Sprint 2 |
| RF08 | O usuário deve poder cadastrar um currículo preenchendo um formulário, com validação de campos obrigatórios. | ✅ | `POST /api/curriculos` · página `/curriculos/novo` |
| RF09 | O usuário deve poder ver a prévia do currículo enquanto preenche o formulário. | ✅ | Prévia ao vivo em `/curriculos/novo` |
| RF10 | O usuário deve poder importar um currículo existente (PDF ou texto colado). | ⏳ | |
| RF11 | O usuário deve poder editar um currículo. | ⏳ | |
| RF12 | O usuário deve poder excluir um currículo. | ⏳ | |

## Otimização

| ID | Requisito | Sprint 1 | Observação |
| --- | --- | --- | --- |
| RF13 | O usuário deve poder colar a descrição de uma vaga e escolher qual currículo comparar. | ✅ | Página `/otimizar` |
| RF14 | O sistema deve gerar um relatório de compatibilidade com percentual, palavras-chave encontradas e faltantes. | 🟡 | Simulação por palavras-chave no navegador; IA na Sprint 2 |
| RF15 | O sistema deve sugerir melhorias para adaptar o currículo à vaga. | 🟡 | Sugestões por regras; geração por IA na Sprint 2 |
| RF16 | O sistema deve gerar uma versão otimizada do currículo para ATS com IA. | ⏳ | |
| RF17 | O usuário deve poder exportar o currículo (PDF). | ⏳ | |

## Vagas e candidaturas

| ID | Requisito | Sprint 1 | Observação |
| --- | --- | --- | --- |
| RF18 | O usuário deve poder visualizar suas candidaturas agrupadas por etapa (aplicado, entrevista, oferta, rejeitado). | ✅ | `GET /api/vagas` · página `/vagas` |
| RF19 | O usuário deve poder cadastrar uma candidatura com empresa, cargo, status e link. | 🟡 | `POST /api/vagas` pronto; formulário na Sprint 2 |
| RF20 | O usuário deve poder editar uma candidatura, incluindo mudar a etapa. | ⏳ | |
| RF21 | O usuário deve poder excluir uma candidatura. | ⏳ | |

## Requisitos não funcionais

| ID | Requisito | Sprint 1 |
| --- | --- | --- |
| RNF01 | Interface responsiva, mobile-first, sem scroll horizontal (480/768/1024/1440px). | ✅ |
| RNF02 | Respostas da API em JSON com códigos HTTP corretos (200, 201, 400, 404, 500). | ✅ |
| RNF03 | Mensagens de erro em português, sem detalhes técnicos para o usuário. | ✅ |
| RNF04 | Configuração por variáveis de ambiente; segredos fora do Git. | ✅ |
| RNF05 | Dados pessoais tratados conforme a LGPD (consentimento, exclusão de conta). | ⏳ |
| RNF06 | Acessibilidade básica: rótulos nos campos, foco visível, navegação por teclado. | ✅ |

## Backlog (Should e Could)

Filtro de currículos · filtro de vagas · categorização de currículos · notificações por WhatsApp ·
chatbot · funcionamento offline · auto-complete de campos · pesquisa de vagas online ·
notificações por e-mail · plano pago.
