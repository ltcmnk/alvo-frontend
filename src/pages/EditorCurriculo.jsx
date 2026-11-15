import { useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import FormularioCurriculo from '../components/curriculo/FormularioCurriculo'
import MensagemEnvio from '../components/curriculo/MensagemEnvio'
import PainelPrevia from '../components/curriculo/PainelPrevia'
import BotoesExportar from '../components/editor/BotoesExportar'
import RevisaoOrtografica from '../components/editor/RevisaoOrtografica'
import useApi from '../hooks/useApi'
import useFormCurriculo from '../hooks/useFormCurriculo'
import { buscarCurriculo } from '../services/curriculoService'
import { conteudoDoCurriculo, paraApi, paraFormulario } from '../utils/curriculo'
import './EditorCurriculo.css'

/**
 * Editor com o currículo já carregado: formulário, prévia/leitura ATS, ortografia, exportação e salvar.
 * @param {object} props
 * @param {object} props.curriculo - Currículo salvo ou gerado pela IA.
 * @param {number} [props.id] - Presente quando o currículo já está salvo (salva com PUT).
 * @param {object} [props.extras] - Tipo, origem e vaga quando vem da otimização (vão no POST).
 */
function Editor({ curriculo, id, extras }) {
  const navigate = useNavigate()
  const form = useFormCurriculo(paraFormulario(conteudoDoCurriculo(curriculo)), { id, extras })
  const enviando = form.envio.status === 'enviando'

  async function salvar(evento) {
    const salvo = await form.enviar(evento)
    // Versão nova (vinda da otimização): passa a ser editada pelo id, para o próximo salvar não duplicar
    if (salvo && !id) navigate(`/curriculos/${salvo.id}/editar`, { replace: true })
  }

  // Exporta o que está na tela; com erro de validação, destaca os campos em vez de gerar um arquivo quebrado
  const obterCurriculo = () => (form.validar() ? paraApi(form.valores) : null)

  return (
    <form className="editor" onSubmit={salvar} noValidate>
      <Card className="editor__barra">
        <div className="editor__grupo">
          <p className="titulo-bloco">Exportar</p>
          <div className="editor__botoes">
            <BotoesExportar obterCurriculo={obterCurriculo} />
          </div>
        </div>
        <RevisaoOrtografica form={form} />
      </Card>
      <div className="editor__conteudo">
        <div className="editor__form">
          <FormularioCurriculo form={form} />
          <MensagemEnvio envio={form.envio} />
          <Button type="submit" disabled={enviando} fullWidth>
            {enviando ? 'Salvando…' : id ? 'Salvar alterações' : 'Salvar nos meus currículos'}
          </Button>
        </div>
        <PainelPrevia valores={form.valores} />
      </div>
    </form>
  )
}

/** Carrega o currículo salvo pelo id da rota. */
function EditorPorId({ id }) {
  // useCallback: o useApi repete a chamada sempre que recebe uma função nova
  const buscar = useCallback(() => buscarCurriculo(id), [id])
  const { data, loading, error, recarregar } = useApi(buscar)
  if (loading) return <LoadingSpinner label="Carregando o currículo…" />
  if (error) {
    return (
      <EmptyState
        tone="error"
        title="Não foi possível abrir o currículo"
        description={error}
        action={<Button variant="secondary" onClick={recarregar}>Tentar de novo</Button>}
      />
    )
  }
  return <Editor curriculo={data} id={data.id} />
}

/**
 * Página do editor: `/curriculos/:id/editar` edita um currículo salvo;
 * `/curriculos/editar` edita a versão que veio da otimização, antes de salvar.
 */
export default function EditorCurriculo() {
  const { id } = useParams()
  const { state } = useLocation()

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <p className="page__rotulo">{state?.curriculo ? 'Versão gerada pela IA' : 'Editor'}</p>
          <h1 className="page__title">Revisar e exportar</h1>
          <p className="page__lead">
            Ajuste o texto, revise a ortografia e baixe o arquivo. A formatação segue o padrão ATS: uma coluna, títulos
            padrão e nada de tabelas ou ícones.
          </p>
        </div>
      </header>
      {id && <EditorPorId key={id} id={id} />}
      {!id && state?.curriculo && <Editor curriculo={state.curriculo} extras={state.extras} />}
      {!id && !state?.curriculo && (
        <EmptyState
          title="Nada para editar"
          description="Escolha um currículo na sua lista ou otimize um para revisar aqui."
          action={<Button to="/curriculos">Ver meus currículos</Button>}
        />
      )}
    </section>
  )
}
