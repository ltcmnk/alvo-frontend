import Button from '../components/common/Button'
import Card from '../components/common/Card'
import FormField from '../components/common/FormField'
import ExperienciaFields from '../components/curriculo/ExperienciaFields'
import PreviaCurriculo from '../components/curriculo/PreviaCurriculo'
import useFormCurriculo from '../hooks/useFormCurriculo'
import './CriarCurriculo.css'

/** Bloco do formulário com título; agrupa campos relacionados. */
function Secao({ titulo, children }) {
  return (
    <Card as="fieldset" className="secao-form">
      <legend className="secao-form__titulo">{titulo}</legend>
      <div className="secao-form__campos">{children}</div>
    </Card>
  )
}

/** Retorno do envio: sucesso com atalho para a lista, ou o erro vindo da API. */
function MensagemEnvio({ envio }) {
  if (envio.status === 'sucesso') {
    return (
      <div className="mensagem-envio mensagem-envio--sucesso" role="status">
        <p>{envio.mensagem}</p>
        <Button to="/curriculos" variant="secondary" size="sm">
          Ver meus currículos
        </Button>
      </div>
    )
  }
  if (envio.status === 'erro') {
    return (
      <p className="mensagem-envio mensagem-envio--erro" role="alert">
        {envio.mensagem}
      </p>
    )
  }
  return null
}

/** Nome, e-mail e cargo-alvo: nome e cargo são obrigatórios também na API. */
function SecaoDadosPessoais({ valores, erros, aoAlterar }) {
  return (
    <Secao titulo="Dados pessoais">
      <FormField
        label="Nome completo"
        name="nome"
        autoComplete="name"
        value={valores.nome}
        onChange={aoAlterar}
        error={erros.nome}
        obrigatorio
      />
      <FormField
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        value={valores.email}
        onChange={aoAlterar}
        error={erros.email}
      />
      <FormField
        label="Cargo que você busca"
        name="cargoAlvo"
        placeholder="Ex.: Desenvolvedor Back-end Pleno"
        value={valores.cargoAlvo}
        onChange={aoAlterar}
        error={erros.cargoAlvo}
        obrigatorio
      />
    </Secao>
  )
}

/** Resumo, formação e habilidades. */
function SecaoPerfil({ valores, aoAlterar }) {
  return (
    <Secao titulo="Perfil">
      <FormField
        as="textarea"
        label="Resumo profissional"
        name="resumo"
        rows={4}
        hint="2 a 3 linhas sobre quem você é e o que entrega."
        value={valores.resumo}
        onChange={aoAlterar}
      />
      <FormField
        label="Formação"
        name="formacao"
        placeholder="Ex.: Sistemas de Informação, 2022"
        value={valores.formacao}
        onChange={aoAlterar}
      />
      <FormField
        label="Habilidades"
        name="habilidades"
        placeholder="Ex.: React, Node.js, SQL"
        hint="Separe por vírgula."
        value={valores.habilidades}
        onChange={aoAlterar}
      />
    </Secao>
  )
}

/** Título e orientação da página. */
function CabecalhoPagina() {
  return (
    <header className="page__header">
      <div>
        <h1 className="page__title">Criar currículo</h1>
        <p className="page__lead">
          Preencha o que tiver agora e complete depois. Campos com * são obrigatórios.
        </p>
      </div>
    </header>
  )
}

/** Página de criação de currículo: formulário à esquerda e prévia ao vivo à direita (US01–US03). */
export default function CriarCurriculo() {
  const form = useFormCurriculo()
  const { valores, erros, envio } = form
  const enviando = envio.status === 'enviando'

  return (
    <section className="page container">
      <CabecalhoPagina />
      <div className="criar-curriculo">
        <form className="criar-curriculo__form" onSubmit={form.enviar} noValidate>
          <SecaoDadosPessoais valores={valores} erros={erros} aoAlterar={form.atualizarCampo} />
          <SecaoPerfil valores={valores} aoAlterar={form.atualizarCampo} />
          <Secao titulo="Experiência profissional">
            <ExperienciaFields
              experiencias={valores.experiencias}
              erros={erros}
              aoAlterar={form.atualizarExperiencia}
              aoAdicionar={form.adicionarExperiencia}
              aoRemover={form.removerExperiencia}
            />
          </Secao>
          <MensagemEnvio envio={envio} />
          <Button type="submit" disabled={enviando} fullWidth>
            {enviando ? 'Salvando…' : 'Salvar currículo'}
          </Button>
        </form>
        <PreviaCurriculo valores={valores} />
      </div>
    </section>
  )
}
