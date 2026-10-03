# Alvo — Escopo do MVP

## O que é o Alvo

O **Alvo** é uma aplicação web que ajuda candidatos brasileiros a criar um currículo estruturado,
adaptá-lo para cada vaga com apoio de inteligência artificial e acompanhar as candidaturas da
inscrição ao contrato assinado.

## Escopo do MVP

O MVP permite que o candidato entre com sua conta, cadastre ou importe o currículo e o mantenha
organizado em versões. Para cada vaga de interesse, ele cola a descrição do anúncio e recebe um
**relatório de compatibilidade**: quais palavras-chave da vaga já estão no currículo, quais faltam
e sugestões concretas de melhoria geradas por IA, além de uma versão otimizada para leitura por
sistemas ATS que pode ser exportada.

Em paralelo, o candidato registra as vagas em que se inscreveu e acompanha o status de cada uma
(aplicado, entrevista, oferta ou rejeitado), tendo em um só lugar o histórico que hoje fica
espalhado entre e-mails, planilhas e plataformas de emprego.

## Problema

> Candidatos a vagas de estágio e emprego enfrentam um processo de candidatura **fragmentado, manual e sem retorno**, o que os impede de se destacar e de entender por que não são selecionados.

O que a pesquisa de empatia mostrou:

- O mesmo currículo genérico é enviado para vagas diferentes, porque adaptar cada versão à mão leva tempo.
- Filtros automáticos (ATS) descartam currículos por falta de palavras-chave, e o candidato nunca fica sabendo o motivo.
- Não há retorno das empresas; o candidato não sabe o que melhorar.
- As candidaturas ficam espalhadas, sem controle de prazos, entrevistas e respostas.
- As soluções existentes são estrangeiras, cobradas em dólar, sem PIX e sem conformidade com a LGPD, ou não juntam otimização de currículo e acompanhamento de candidaturas.

## Objetivos

1. **Aumentar a taxa de chamadas para entrevista** dos usuários, com currículos adaptados a cada vaga.
2. **Dar retorno** ao candidato: mostrar por que o currículo combina ou não com a vaga.
3. **Organizar a candidatura do início ao fim** em um único painel.
4. Ser **acessível e pensado para o Brasil**: preço em real, português, conformidade com a LGPD.

## Declaração de necessidade

> Uma maneira de **otimizar currículos automaticamente para sistemas ATS e adaptar candidaturas a vagas específicas com inteligência artificial**, para **profissionais brasileiros em busca de emprego**, a fim de **aumentar a taxa de chamadas para entrevista e organizar o processo de candidatura do início ao contrato assinado**.

## Como o Alvo resolve

| Dor | Como o Alvo resolve |
| --- | --- |
| Currículo genérico para todas as vagas | Versões do currículo (base, otimizado, sob medida) geradas a partir do mesmo cadastro |
| Reprovação silenciosa pelo ATS | Relatório de compatibilidade com palavras-chave encontradas e faltantes |
| Falta de retorno | Sugestões de melhoria específicas para a vaga escolhida |
| Candidaturas espalhadas | Quadro de candidaturas por etapa |
| Ferramentas caras e estrangeiras | Produto nacional, em português, com preço acessível e LGPD |

## Público e personas

**Público-alvo:** profissionais brasileiros em busca de emprego ou estágio, incluindo quem busca
o primeiro emprego, quem está em recolocação e quem está mudando de área.

| Persona | Perfil | O que precisa do Alvo |
| --- | --- | --- |
| **Marcelo Andrade**, 32 | Profissional de tecnologia, nível pleno, empregado, buscando crescimento e melhor salário | Adaptar rápido o currículo a cada vaga e passar pelos filtros ATS |
| **Renata Oliveira** | Profissional em mudança de área | Traduzir a experiência anterior para a linguagem da nova área |
| **Júlia Ferreira** | Recém-formada buscando o primeiro emprego | Montar um currículo competitivo mesmo com pouca experiência |

## Diferencial

Nenhuma solução nacional junta **otimização de currículo com IA** e **acompanhamento de
candidaturas** em um produto honesto, acessível, em conformidade com a LGPD e feito para o Brasil.

## Priorização (MoSCoW)

| Categoria | Funcionalidades |
| --- | --- |
| **Must** | Login via OAuth · visualizar, cadastrar, editar e deletar **vagas** · visualizar, cadastrar (importação), editar e deletar **currículos** · melhoria de currículo por IA · relatório de compatibilidade · exportação de currículo · cadastrar, editar, visualizar e deletar **usuário** |
| **Should** | Filtro de currículos · filtro de vagas · categorização de currículos · notificações por WhatsApp |
| **Could** | Chatbot · funcionamento offline · auto-complete de campos · pesquisa de vagas online · notificações por e-mail · plano pago |
| **Won't (agora)** | Consultoria humana · integração com LinkedIn · compartilhamento de currículo · seletor de modelos de IA |

## O que a Semana 1 entrega

A Semana 1 constrói a **base técnica e organizacional** sobre a qual o MVP será desenvolvido:

- Dois repositórios (`alvo-frontend` e `alvo-api`) com fluxo `feature → develop → qas → main`.
- API com health check, currículos (listar, buscar, criar) e vagas (listar, criar), com dados mock.
- Frontend com 6 rotas, design system, integração real com a API e layout responsivo.
- Simulação do relatório de compatibilidade por palavras-chave, no formato que a IA vai preencher.
- Documentação, user stories, backlog no Trello e protótipo de baixa fidelidade.

## Fora do MVP

- Consultoria humana, integração com LinkedIn, compartilhamento de currículo e seletor de modelos
  de IA (classificados como Won't).
- Recursos do protótipo de alta fidelidade que não estão no MoSCoW como Must: créditos de IA,
  chave própria de API (BYOK), tradução de currículo e planos pagos.

## Fora da Semana 1 (entra nas próximas sprints)

Banco de dados, OAuth real, IA real, edição e exclusão de registros, importação de PDF,
exportação, pagamento, tradução e quadro de candidaturas com arrastar e soltar.
