import { useState } from 'react'
import Button from '../common/Button'
import { extrairMensagemErro } from '../../services/api'
import { exportarCurriculo } from '../../services/exportacaoService'

const FORMATOS = [
  { id: 'pdf', rotulo: 'PDF' },
  { id: 'docx', rotulo: 'DOCX' },
  { id: 'tex', rotulo: 'LaTeX' },
]

/**
 * Botões de download do currículo. Recebe uma função porque o conteúdo é lido na hora do clique
 * (no editor, ele muda a cada tecla).
 * @param {object} props
 * @param {() => object|null} props.obterCurriculo - Devolve o corpo no formato da API, ou null se houver erro no formulário.
 * @param {('pdf'|'docx'|'tex')[]} [props.formatos] - Quais botões mostrar.
 */
export default function BotoesExportar({ obterCurriculo, formatos = ['pdf', 'docx', 'tex'] }) {
  const [baixando, setBaixando] = useState(null)
  const [erro, setErro] = useState('')

  async function baixar(formato) {
    const curriculo = obterCurriculo()
    if (!curriculo) {
      setErro('Corrija os campos destacados antes de exportar.')
      return
    }
    setErro('')
    setBaixando(formato)
    try {
      await exportarCurriculo(curriculo, formato)
    } catch (falha) {
      setErro(extrairMensagemErro(falha))
    } finally {
      setBaixando(null)
    }
  }

  return (
    <>
      {FORMATOS.filter((formato) => formatos.includes(formato.id)).map((formato) => (
        <Button key={formato.id} variant="secondary" size="sm" disabled={Boolean(baixando)} onClick={() => baixar(formato.id)}>
          {baixando === formato.id ? 'Gerando…' : formato.rotulo}
        </Button>
      ))}
      {erro && (
        <span className="mensagem-envio mensagem-envio--erro" role="alert">
          {erro}
        </span>
      )}
    </>
  )
}
