import { useRef, useState } from 'react'
import Button from '../common/Button'
import FormField from '../common/FormField'
import useApi from '../../hooks/useApi'
import { extrairMensagemErro } from '../../services/api'
import { listarCurriculos } from '../../services/curriculoService'
import { STATUS_VAGA, criarVaga } from '../../services/vagaService'
import './NovaCandidatura.css'

const VAZIO = { empresa: '', cargo: '', status: 'aplicado', link: '', curriculoId: '', notas: '' }
const ROTULOS = { aplicado: 'Aplicado', entrevista: 'Entrevista', oferta: 'Oferta', rejeitado: 'Rejeitado' }

/** Converte o formulário no corpo do POST: sem campos vazios e com o id do currículo como número. */
function montarCorpo(dados) {
  const corpo = Object.fromEntries(Object.entries(dados).filter(([, valor]) => valor.trim()))
  if (corpo.curriculoId) corpo.curriculoId = Number(corpo.curriculoId)
  return corpo
}

function CamposCandidatura({ dados, alterar }) {
  const { data: curriculos } = useApi(listarCurriculos)
  return (
    <>
      <div className="campos-duplos">
        <FormField label="Empresa" name="empresa" value={dados.empresa} onChange={alterar} obrigatorio />
        <FormField label="Cargo" name="cargo" value={dados.cargo} onChange={alterar} obrigatorio />
        <FormField as="select" label="Etapa" name="status" value={dados.status} onChange={alterar}>
          {STATUS_VAGA.map((status) => (
            <option key={status} value={status}>
              {ROTULOS[status]}
            </option>
          ))}
        </FormField>
        <FormField as="select" label="Currículo enviado" name="curriculoId" value={dados.curriculoId} onChange={alterar}>
          <option value="">Não informar</option>
          {(curriculos ?? []).map((curriculo) => (
            <option key={curriculo.id} value={curriculo.id}>
              {curriculo.cargoAlvo}
            </option>
          ))}
        </FormField>
      </div>
      <FormField label="Link da vaga" name="link" type="url" placeholder="https://" value={dados.link} onChange={alterar} />
      <FormField as="textarea" label="Notas" name="notas" rows={3} placeholder="Recrutador, data da entrevista, próximos passos…" value={dados.notas} onChange={alterar} />
    </>
  )
}

/**
 * Botão "+ Nova candidatura" que abre um <dialog> nativo com o formulário (RF12).
 * O <dialog> já cuida do foco, do Esc para fechar e do fundo escurecido.
 * @param {object} props
 * @param {() => void} props.aoCriar - Chamado depois de salvar, para recarregar o quadro.
 */
export default function NovaCandidatura({ aoCriar }) {
  const dialogo = useRef(null)
  const [dados, setDados] = useState(VAZIO)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const alterar = ({ target }) => setDados((atual) => ({ ...atual, [target.name]: target.value }))

  function fechar() {
    dialogo.current.close()
    setDados(VAZIO)
    setErro('')
  }

  async function salvar(evento) {
    evento.preventDefault()
    if (!dados.empresa.trim() || !dados.cargo.trim()) {
      setErro('Informe empresa e cargo.')
      return
    }
    setEnviando(true)
    try {
      await criarVaga(montarCorpo(dados))
      fechar()
      aoCriar()
    } catch (falha) {
      setErro(extrairMensagemErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Button onClick={() => dialogo.current.showModal()}>+ Nova candidatura</Button>
      <dialog ref={dialogo} className="nova-candidatura" aria-labelledby="titulo-nova-candidatura" onClose={() => setErro('')}>
        <form onSubmit={salvar} noValidate className="nova-candidatura__form">
          <h2 id="titulo-nova-candidatura" className="nova-candidatura__titulo">
            Nova candidatura
          </h2>
          <CamposCandidatura dados={dados} alterar={alterar} />
          {erro && (
            <p className="mensagem-envio mensagem-envio--erro" role="alert">
              {erro}
            </p>
          )}
          <div className="nova-candidatura__acoes">
            <Button variant="secondary" onClick={fechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Salvando…' : 'Salvar candidatura'}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  )
}
