# Alvo — Requisitos funcionais

Derivados dos itens **Must** da priorização MoSCoW (e do *Should* "seletor de IA", promovido na
Sprint 2). As colunas indicam o que foi entregue em cada sprint.

Legenda: ✅ entregue · 🟡 parcial (base pronta, complemento previsto) · ⏳ próximas sprints

## Usuário e acesso

| ID | Requisito | Sprint 1 | Sprint 2 | Observação |
| --- | --- | --- | --- | --- |
| RF01 | O sistema deve permitir login com conta Google via OAuth. | ⏳ | ⏳ | Entra junto com o banco de dados |
| RF02 | O sistema deve permitir cadastrar o usuário a partir do primeiro login. | ⏳ | ⏳ | |
| RF03 | O usuário deve poder visualizar seus dados de perfil. | ⏳ | ⏳ | |
| RF04 | O usuário deve poder editar seus dados de perfil. | ⏳ | ⏳ | |
| RF05 | O usuário deve poder excluir sua conta e todos os seus dados (LGPD). | ⏳ | ⏳ | |

## Currículos

| ID | Requisito | Sprint 1 | Sprint 2 | Observação |
| --- | --- | --- | --- | --- |
| RF06 | O usuário deve poder visualizar a lista dos seus currículos, com tipo, pontuação e data. | ✅ | ✅ | Filtro por tipo (base, otimizado, sob medida) |
| RF07 | O usuário deve poder visualizar um currículo específico. | 🟡 | ✅ | `/curriculos/:id/editar` com prévia |
| RF08 | O usuário deve poder cadastrar um currículo preenchendo um formulário, com validação de campos obrigatórios. | ✅ | ✅ | Formulário completo: contatos, experiências, formações, projetos, competências, idiomas, certificações, atividades |
| RF09 | O usuário deve poder ver a prévia do currículo enquanto preenche o formulário. | ✅ | ✅ | Prévia igual ao PDF exportado + leitura ATS |
| RF10 | O usuário deve poder importar um currículo existente (PDF ou DOCX). | ⏳ | ✅ | Só leitura: preenche o formulário, o arquivo não é salvo (`POST /api/documentos/ler`) |
| RF11 | O usuário deve poder editar um currículo. | ⏳ | ✅ | Editor (`PUT /api/curriculos/:id`) |
| RF12 | O usuário deve poder excluir um currículo. | ⏳ | ✅ | `DELETE /api/curriculos/:id` |

## Otimização

| ID | Requisito | Sprint 1 | Sprint 2 | Observação |
| --- | --- | --- | --- | --- |
| RF13 | O usuário deve poder colar a descrição de uma vaga e escolher qual currículo comparar. | ✅ | ✅ | |
| RF14 | O sistema deve gerar um relatório de compatibilidade com requisitos atendidos e em falta, antes de salvar. | 🟡 | ✅ | `POST /api/ia/compatibilidade`, com "como preencher" cada gap |
| RF15 | O sistema deve sugerir melhorias para adaptar o currículo à vaga. | 🟡 | ✅ | Sugestões futuras e riscos, fora do currículo |
| RF16 | O sistema deve gerar uma versão otimizada do currículo para ATS com IA. | ⏳ | ✅ | `POST /api/ia/otimizar` (Anthropic, OpenAI ou Google) |
| RF17 | O usuário deve poder exportar o currículo em PDF e DOCX. | ⏳ | ✅ | Também LaTeX para o Overleaf (`POST /api/documentos/exportar`) |
| RF22 | O sistema deve dar ao currículo uma nota ATS de 0 a 100, com critérios. | — | ✅ | Calculada por regras: seções, palavras-chave, impacto, formatação |
| RF23 | O sistema deve analisar a descrição da vaga e sugerir as palavras-chave do setor. | — | ✅ | Automático ao colar a vaga (`POST /api/ia/analisar-vaga`) |
| RF24 | O sistema deve valorizar projetos acadêmicos, sugerindo como escrevê-los como experiência prática. | — | ✅ | No relatório de compatibilidade |
| RF25 | O sistema deve mostrar como um ATS lê o currículo (texto, campos extraídos e alertas). | — | ✅ | `POST /api/curriculos/previa-ats` |
| RF26 | O usuário deve poder editar a versão gerada pela IA antes de salvar e exportar. | — | ✅ | `/curriculos/editar` |
| RF27 | O sistema deve revisar a ortografia das edições do usuário. | — | ✅ | LanguageTool pt-BR + corretor nativo do navegador |
| RF28 | O usuário deve poder escolher o provedor de IA antes de otimizar. | — | ✅ | Should; sem chave, modo demonstração |
| RF29 | A IA não pode inventar informações que não estão no currículo. | — | ✅ | Regra no prompt + trava de fatos no código |

## Vagas e candidaturas

| ID | Requisito | Sprint 1 | Sprint 2 | Observação |
| --- | --- | --- | --- | --- |
| RF18 | O usuário deve poder visualizar suas candidaturas agrupadas por etapa. | ✅ | ✅ | Kanban com contadores |
| RF19 | O usuário deve poder cadastrar uma candidatura com empresa, cargo, status e link. | 🟡 | ✅ | Pela página Candidaturas ou ao salvar uma versão otimizada |
| RF20 | O usuário deve poder editar uma candidatura, incluindo mudar a etapa. | ⏳ | ✅ | `PATCH /api/vagas/:id` |
| RF21 | O usuário deve poder excluir uma candidatura. | ⏳ | ✅ | `DELETE /api/vagas/:id` |

## Requisitos não funcionais

| ID | Requisito | Status |
| --- | --- | --- |
| RNF01 | Interface responsiva, mobile-first, sem scroll horizontal (480/768/1024/1440px). | ✅ |
| RNF02 | Respostas da API em JSON com códigos HTTP corretos (200, 201, 204, 400, 404, 413, 429, 500, 502, 503). | ✅ |
| RNF03 | Mensagens de erro em português, sem detalhes técnicos para o usuário. | ✅ |
| RNF04 | Configuração por variáveis de ambiente; chaves de IA só no backend, fora do Git. | ✅ |
| RNF05 | Dados pessoais tratados conforme a LGPD (sem CPF/RG/foto no currículo; arquivo enviado não é salvo). | 🟡 |
| RNF06 | Acessibilidade básica: rótulos nos campos, foco visível, navegação por teclado. | ✅ |
| RNF07 | Documentos exportados legíveis por ATS: uma coluna, texto selecionável, sem tabelas e ícones. | ✅ |

## Backlog (Should e Could)

Filtro de vagas · notificações por WhatsApp · chatbot · funcionamento offline · auto-complete de
campos · pesquisa de vagas online · notificações por e-mail · plano pago.
