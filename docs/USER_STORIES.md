# Alvo — User stories

Formato: **Como** [persona], **quero** [ação] **para** [benefício]. Cada história tem critérios de
aceite verificáveis. Status refere-se à Sprint 1.

---

## US01 — Criar currículo

**Como** candidato, **quero** criar um currículo **para** organizar minhas informações profissionais.

Status: ✅ entregue (`/curriculos/novo` · `POST /api/curriculos`)

Critérios de aceite:

- [ ] O formulário tem nome, e-mail, cargo-alvo, resumo, formação e habilidades.
- [ ] Nome e cargo-alvo são obrigatórios; sem eles aparece uma mensagem ao lado do campo e nada é enviado.
- [ ] E-mail, quando preenchido, precisa ser válido.
- [ ] Ao salvar, a API responde 201 e a tela confirma com a pontuação do currículo.
- [ ] O currículo criado aparece em "Meus currículos".
- [ ] Se a API estiver fora do ar, a tela mostra o erro sem perder o que foi digitado.

## US02 — Adicionar experiências

**Como** candidato, **quero** adicionar minhas experiências **para** apresentar meu histórico profissional.

Status: ✅ entregue

Critérios de aceite:

- [ ] Posso adicionar quantas experiências quiser e remover qualquer uma.
- [ ] Cada experiência tem cargo e empresa (obrigatórios), período e descrição.
- [ ] Uma experiência incompleta mostra o aviso "Preencha cargo e empresa, ou remova esta experiência".
- [ ] As experiências são enviadas junto com o currículo.

## US03 — Visualizar antes de finalizar

**Como** candidato, **quero** visualizar meu currículo antes de finalizá-lo **para** verificar como
minhas informações serão apresentadas.

Status: ✅ entregue (prévia ao vivo)

Critérios de aceite:

- [ ] A prévia atualiza enquanto eu digito, sem precisar salvar.
- [ ] Seções vazias não aparecem na prévia.
- [ ] No desktop a prévia fica ao lado do formulário; no celular, abaixo.

## US04 — Comparar com uma vaga

**Como** candidato, **quero** inserir a descrição de uma vaga **para** ver a compatibilidade com meu currículo.

Status: 🟡 entregue como simulação por palavras-chave (IA na Sprint 2)

Critérios de aceite:

- [ ] Escolho um dos meus currículos e colo a descrição da vaga.
- [ ] A descrição precisa ter pelo menos 80 caracteres; senão aparece uma orientação.
- [ ] O resultado mostra o percentual de compatibilidade.
- [ ] O resultado lista as palavras-chave da vaga que já estão e as que faltam no currículo.

## US05 — Receber sugestões de melhoria

**Como** candidato, **quero** receber sugestões de melhoria **para** adaptar meu currículo à vaga.

Status: 🟡 entregue com sugestões por regras (IA na Sprint 2)

Critérios de aceite:

- [ ] O relatório traz pelo menos uma sugestão.
- [ ] As sugestões citam termos faltantes da vaga quando houver.
- [ ] Há sugestão para quantificar resultados quando as experiências não têm números.
- [ ] A tela informa que a análise atual é uma simulação.

## US06 — Acompanhar candidaturas

**Como** candidato, **quero** cadastrar as vagas em que me candidatei e o status de cada uma
**para** acompanhar meu processo seletivo em um só lugar.

Status: 🟡 visualização entregue (`/vagas`); cadastro pela interface na Sprint 2 (`POST /api/vagas` já pronto)

Critérios de aceite:

- [ ] As candidaturas aparecem agrupadas por etapa: aplicado, entrevista, oferta e rejeitado.
- [ ] Cada etapa mostra o total de vagas.
- [ ] Cada candidatura mostra empresa, cargo e data.
- [ ] Cadastrar sem empresa ou cargo retorna erro 400 com mensagem clara.

---

## Próximas histórias (backlog)

- **US07** Como candidato, quero entrar com minha conta Google para não precisar criar senha.
- **US08** Como candidato, quero importar meu currículo em PDF para não digitar tudo de novo.
- **US09** Como candidato, quero editar e excluir currículos e candidaturas para manter tudo atualizado.
- **US10** Como candidato, quero exportar meu currículo em PDF para enviar às empresas.
- **US11** Como candidato, quero excluir minha conta e meus dados para exercer meu direito pela LGPD.
