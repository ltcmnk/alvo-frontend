# Alvo — User stories

Formato: **Como** [persona], **quero** [ação] **para** [benefício]. Cada história tem critérios de
aceite verificáveis. O status indica em que sprint a história foi entregue.

---

## US01 — Criar currículo

**Como** candidato, **quero** criar um currículo **para** organizar minhas informações profissionais.

Status: ✅ Sprint 1 · ampliada na Sprint 2 (formulário completo)

Critérios de aceite:

- [ ] O formulário tem contatos (e-mail, telefone, cidade, LinkedIn, GitHub, portfólio), cargo-alvo, resumo,
      experiências, formações, projetos, competências técnicas e comportamentais, idiomas, certificações e atividades.
- [ ] Nome e cargo-alvo são obrigatórios; sem eles aparece uma mensagem ao lado do campo e nada é enviado.
- [ ] E-mail, quando preenchido, precisa ser válido.
- [ ] Ao salvar, a API responde 201 e a tela confirma com a nota ATS do currículo.
- [ ] O currículo criado aparece em "Meus currículos".
- [ ] Se a API estiver fora do ar, a tela mostra o erro sem perder o que foi digitado.

## US02 — Adicionar experiências

**Como** candidato, **quero** adicionar minhas experiências **para** apresentar meu histórico profissional.

Status: ✅ Sprint 1

Critérios de aceite:

- [ ] Posso adicionar quantas experiências quiser e remover qualquer uma.
- [ ] Cada experiência tem cargo e empresa (obrigatórios), cidade, início, fim (ou "atual") e descrição.
- [ ] Uma experiência incompleta mostra o aviso "Preencha cargo e empresa, ou remova esta experiência".
- [ ] As experiências são enviadas junto com o currículo.

## US03 — Visualizar antes de finalizar

**Como** candidato, **quero** visualizar meu currículo antes de finalizá-lo **para** verificar como
minhas informações serão apresentadas.

Status: ✅ Sprint 1 · na Sprint 2 a prévia passa a ser igual ao PDF exportado

Critérios de aceite:

- [ ] A prévia atualiza enquanto eu digito, sem precisar salvar.
- [ ] Seções vazias não aparecem na prévia.
- [ ] No desktop a prévia fica ao lado do formulário; no celular, abaixo.

## US04 — Comparar com uma vaga

**Como** candidato, **quero** inserir a descrição de uma vaga **para** ver a compatibilidade com meu currículo.

Status: ✅ Sprint 2 (com IA; Sprint 1 era simulação)

Critérios de aceite:

- [ ] Escolho um dos meus currículos e colo a descrição da vaga.
- [ ] A descrição precisa ter pelo menos 80 caracteres; senão aparece uma orientação.
- [ ] O resultado mostra o percentual de compatibilidade e quais requisitos atendo, atendo em parte ou não atendo.
- [ ] O resultado lista as palavras-chave da vaga que já estão e as que faltam no currículo.

## US05 — Receber sugestões de melhoria

**Como** candidato, **quero** receber sugestões de melhoria **para** adaptar meu currículo à vaga.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] O relatório traz pelo menos uma sugestão.
- [ ] As sugestões citam termos faltantes da vaga quando houver.
- [ ] Há sugestão para quantificar resultados quando as experiências não têm números.
- [ ] Cada requisito em falta traz "como preencher" sem sugerir inventar experiência.
- [ ] No modo demonstração (sem chave de IA) a tela avisa que a análise é por regras.

## US06 — Acompanhar candidaturas

**Como** candidato, **quero** cadastrar as vagas em que me candidatei e o status de cada uma
**para** acompanhar meu processo seletivo em um só lugar.

Status: ✅ Sprint 2 (visualização na Sprint 1)

Critérios de aceite:

- [ ] As candidaturas aparecem agrupadas por etapa: aplicado, entrevista, oferta e rejeitado.
- [ ] Cada etapa mostra o total de vagas.
- [ ] Cada candidatura mostra empresa, cargo e data.
- [ ] Cadastro pelo botão "Nova candidatura"; sem empresa ou cargo aparece o erro e nada é salvo.
- [ ] Posso mudar a etapa e excluir a candidatura.

---

## US07 — Entrar com Google

**Como** candidato, **quero** entrar com minha conta Google **para** não precisar criar senha.

Status: ⏳ próximas sprints

## US08 — Importar currículo existente

**Como** candidato, **quero** enviar o PDF ou DOCX do meu currículo **para** não digitar tudo de novo.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] Aceita PDF e DOCX de até 5 MB; outros formatos mostram como resolver.
- [ ] O texto lido aparece para conferência e preenche o formulário só quando eu confirmo.
- [ ] O arquivo não é salvo: só o conteúdo que eu revisar e salvar.

## US09 — Editar e excluir

**Como** candidato, **quero** editar e excluir currículos e candidaturas **para** manter tudo atualizado.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] Editar abre o mesmo formulário com os dados e salva com PUT.
- [ ] Excluir pede confirmação.

## US10 — Exportar o currículo

**Como** candidato, **quero** baixar meu currículo em PDF ou DOCX **para** enviar às empresas.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] O arquivo tem uma coluna, texto selecionável e títulos padrão (legível por ATS).
- [ ] Também posso baixar em LaTeX para editar no Overleaf.
- [ ] O nome do arquivo leva o meu nome (ex.: `curriculo-julia-ferreira.pdf`).

## US11 — Excluir minha conta

**Como** candidato, **quero** excluir minha conta e meus dados **para** exercer meu direito pela LGPD.

Status: ⏳ próximas sprints

## US12 — Nota ATS

**Como** candidato, **quero** ver uma nota de 0 a 100 do meu currículo **para** saber o quanto ele está pronto para os filtros automáticos.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] A nota aparece na lista, na prévia e no resultado da otimização (antes → depois).
- [ ] Cada critério (seções, palavras-chave, impacto, formatação) mostra sua nota e dicas.
- [ ] Nenhuma dica pede para inventar números ou experiências.

## US13 — Escolher a IA

**Como** candidato, **quero** escolher entre Anthropic, OpenAI e Google antes de otimizar **para** usar o provedor disponível.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] Provedor sem chave configurada aparece desabilitado ("sem chave").
- [ ] Sem nenhuma chave, o modo demonstração funciona com o mesmo formato de resultado.

## US14 — Analisar a vaga automaticamente

**Como** candidato, **quero** que o Alvo extraia as palavras-chave da vaga enquanto eu colo o texto **para** saber o que incluir antes de enviar.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] Com 80 caracteres ou mais, aparecem cargo, senioridade, área e as palavras-chave por importância.
- [ ] Funciona para qualquer área (tecnologia, finanças, saúde, vendas, RH...).

## US15 — Valorizar projetos acadêmicos

**Como** estudante, **quero** que meus projetos acadêmicos contem como experiência **para** competir mesmo sem emprego anterior.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] O relatório explica por que cada projeto conta para a vaga e sugere bullets como experiência prática.
- [ ] Para quem está no início da carreira, formação e projetos vêm antes da experiência no documento.

## US16 — Ver como o ATS lê

**Como** candidato, **quero** ver o texto que o ATS enxerga **para** corrigir o que ele não consegue ler.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] Mostra o texto puro na ordem de leitura, os campos extraídos (nome, e-mail, cargo, experiência total...) e alertas.
- [ ] Posso copiar o texto.

## US17 — Revisar antes de salvar

**Como** candidato, **quero** editar a versão gerada pela IA e revisar a ortografia **para** salvar só o que eu aprovar.

Status: ✅ Sprint 2

Critérios de aceite:

- [ ] "Revisar e editar antes de salvar" abre o editor com a versão da IA, sem salvar nada.
- [ ] A revisão ortográfica olha só os campos que eu editei e aplica a sugestão com um clique.
- [ ] Números que a IA escreveu e não estavam no original aparecem para eu conferir.
