import { useState } from 'react'
import Acordeao from '../common/Acordeao'
import Button from '../common/Button'
import Card from '../common/Card'
import FormField from '../common/FormField'
import useApi from '../../hooks/useApi'
import { extrairMensagemErro } from '../../services/api'
import { lerArquivo } from '../../services/documentoService'
import { listarProvedores } from '../../services/iaService'
import './LeitorArquivo.css'

const TAMANHO_MAXIMO = 5 * 1024 * 1024

/** Escolha de quem organiza o texto: regras (grátis, na hora) ou um provedor de IA configurado. */
function EscolhaProvedor({ valor, aoMudar }) {
  const { data } = useApi(listarProvedores)
  const disponiveis = data?.provedores.filter((provedor) => provedor.disponivel) ?? []
  if (disponiveis.length === 0) return null
  return (
    <FormField as="select" label="Organizar o texto com" name="provedor" value={valor} onChange={(e) => aoMudar(e.target.value)}>
      <option value="">Regras do Alvo (sem IA)</option>
      {disponiveis.map((provedor) => (
        <option key={provedor.id} value={provedor.id}>
          {provedor.nome}
        </option>
      ))}
    </FormField>
  )
}

/** Resultado da leitura: avisos, texto extraído e o botão que preenche o formulário. */
function ResultadoLeitura({ leitura, aoUsar, aoDescartar }) {
  return (
    <div className="leitor__resultado" role="status">
      <p>
        Lemos <strong>{leitura.nomeArquivo}</strong>
        {leitura.modo === 'ia' ? ' e organizamos o conteúdo com IA.' : ' e separamos as seções por regras.'}
      </p>
      <ul className="leitor__avisos">
        {leitura.avisos.map((aviso) => (
          <li key={aviso}>{aviso}</li>
        ))}
      </ul>
      <Acordeao titulo="Texto extraído do arquivo">
        <pre className="leitor__texto">{leitura.texto}</pre>
      </Acordeao>
      <div className="leitor__acoes">
        <Button onClick={() => aoUsar(leitura.curriculo)}>Preencher o formulário</Button>
        <Button variant="ghost" onClick={aoDescartar}>
          Descartar
        </Button>
      </div>
    </div>
  )
}

/**
 * Leitura de um currículo que o usuário já tem (PDF ou DOCX), só para aproveitar o conteúdo.
 * O arquivo não é salvo em lugar nenhum: a API lê o texto e descarta o arquivo.
 * @param {object} props
 * @param {(curriculo: object) => void} props.aoUsar - Recebe os campos lidos para preencher o formulário.
 */
export default function LeitorArquivo({ aoUsar }) {
  const [provedor, setProvedor] = useState('')
  const [estado, setEstado] = useState({ status: 'ocioso', leitura: null, erro: '' })

  async function aoEscolher(evento) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = '' // permite escolher o mesmo arquivo de novo depois de descartar
    if (!arquivo) return
    if (arquivo.size > TAMANHO_MAXIMO) {
      setEstado({ status: 'erro', leitura: null, erro: 'O arquivo passa de 5 MB.' })
      return
    }
    setEstado({ status: 'lendo', leitura: null, erro: '' })
    try {
      setEstado({ status: 'lido', leitura: await lerArquivo(arquivo, provedor || undefined), erro: '' })
    } catch (erro) {
      setEstado({ status: 'erro', leitura: null, erro: extrairMensagemErro(erro) })
    }
  }

  const usar = (curriculo) => {
    aoUsar(curriculo)
    setEstado({ status: 'ocioso', leitura: null, erro: '' })
  }

  return (
    <Card className="leitor">
      <div className="leitor__cabecalho">
        <p className="titulo-bloco">Já tem um currículo?</p>
        <p className="leitor__descricao">
          Envie o PDF ou DOCX só para leitura: aproveitamos o conteúdo para preencher o formulário. O arquivo não é salvo.
        </p>
      </div>
      {estado.status === 'lido' ? (
        <ResultadoLeitura leitura={estado.leitura} aoUsar={usar} aoDescartar={() => setEstado({ status: 'ocioso', leitura: null, erro: '' })} />
      ) : (
        <div className="leitor__envio">
          <label className={`leitor__zona${estado.status === 'lendo' ? ' leitor__zona--lendo' : ''}`}>
            <span className="leitor__icone" aria-hidden="true">
              ⬆
            </span>
            {estado.status === 'lendo' ? 'Lendo o arquivo…' : 'Escolher PDF ou DOCX (até 5 MB)'}
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={aoEscolher}
              disabled={estado.status === 'lendo'}
            />
          </label>
          <EscolhaProvedor valor={provedor} aoMudar={setProvedor} />
          {estado.status === 'erro' && (
            <p className="leitor__erro" role="alert">
              {estado.erro}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
