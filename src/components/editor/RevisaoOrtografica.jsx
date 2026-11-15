import { useState } from 'react'
import Button from '../common/Button'
import { lerCaminho } from '../../hooks/useFormCurriculo'
import { extrairMensagemErro } from '../../services/api'
import { revisarOrtografia } from '../../services/exportacaoService'
import './RevisaoOrtografica.css'

// Só campos de texto corrido: nome, e-mail, links e datas dariam falso positivo
const REVISAVEIS = /^(resumo|cargoAlvo|competencias|atividades|\w+\.\d+\.(descricao|cargo|curso))$/
const ROTULOS = { resumo: 'Resumo', cargoAlvo: 'Cargo que você busca', competencias: 'Competências comportamentais', atividades: 'Atividades' }
const LISTAS = { experiencias: 'Experiência', formacoes: 'Formação', projetos: 'Projeto' }
const SUBCAMPOS = { descricao: 'descrição', cargo: 'cargo', curso: 'curso' }

/** "experiencias.3.descricao" → "Experiência 2 (descrição)", para o usuário achar o campo. */
function rotuloCampo(caminho, valores) {
  if (ROTULOS[caminho]) return ROTULOS[caminho]
  const [lista, chave, subcampo] = caminho.split('.')
  const posicao = valores[lista].findIndex((item) => String(item.chave) === chave) + 1
  return `${LISTAS[lista]} ${posicao} (${SUBCAMPOS[subcampo]})`
}

/** Troca o trecho pela sugestão; se o texto mudou desde a revisão, procura o trecho de novo. */
function aplicar(texto, correcao, sugestao) {
  const noLugar = texto.slice(correcao.inicio, correcao.inicio + correcao.tamanho) === correcao.trecho
  const inicio = noLugar ? correcao.inicio : texto.indexOf(correcao.trecho)
  if (inicio < 0) return texto
  return texto.slice(0, inicio) + sugestao + texto.slice(inicio + correcao.tamanho)
}

/**
 * Revisão ortográfica das edições do usuário (só dos campos que ele mudou).
 * Os campos de texto também têm a correção nativa do navegador (spellcheck, pt-BR) enquanto se digita.
 * @param {object} props
 * @param {ReturnType<typeof import('../../hooks/useFormCurriculo').default>} props.form
 */
export default function RevisaoOrtografica({ form }) {
  const [estado, setEstado] = useState({ status: 'ocioso', correcoes: [], erro: '' })
  const campos = [...form.editados]
    .filter((caminho) => REVISAVEIS.test(caminho))
    .map((caminho) => ({ id: caminho, texto: lerCaminho(form.valores, caminho) }))
    .filter((campo) => campo.texto.trim())

  async function revisar() {
    setEstado({ status: 'revisando', correcoes: [], erro: '' })
    try {
      const { correcoes } = await revisarOrtografia(campos)
      setEstado({ status: 'revisado', correcoes, erro: '' })
    } catch (erro) {
      setEstado({ status: 'erro', correcoes: [], erro: extrairMensagemErro(erro) })
    }
  }

  function resolver(correcao, sugestao) {
    if (sugestao !== undefined) {
      form.definirCampo(correcao.campoId, aplicar(lerCaminho(form.valores, correcao.campoId), correcao, sugestao))
    }
    // Correções seguintes no mesmo campo andam junto com a diferença de tamanho do texto
    const diferenca = sugestao === undefined ? 0 : sugestao.length - correcao.tamanho
    setEstado((atual) => ({
      ...atual,
      correcoes: atual.correcoes
        .filter((item) => item !== correcao)
        .map((item) => (item.campoId === correcao.campoId && item.inicio > correcao.inicio ? { ...item, inicio: item.inicio + diferenca } : item)),
    }))
  }

  return (
    <div className="revisao">
      <div className="revisao__topo">
        <p className="revisao__descricao">
          {campos.length
            ? `${campos.length} campo(s) editado(s) por você para revisar.`
            : 'Edite um texto (resumo, descrições, atividades) para revisar a ortografia.'}
        </p>
        <Button variant="escuro" size="sm" onClick={revisar} disabled={!campos.length || estado.status === 'revisando'}>
          {estado.status === 'revisando' ? 'Revisando…' : 'Revisar ortografia'}
        </Button>
      </div>
      {estado.status === 'erro' && (
        <p className="mensagem-envio mensagem-envio--erro" role="alert">
          {estado.erro}
        </p>
      )}
      {estado.status === 'revisado' && estado.correcoes.length === 0 && (
        <p className="mensagem-envio mensagem-envio--sucesso" role="status">
          Nenhum erro encontrado nas suas edições.
        </p>
      )}
      {estado.correcoes.length > 0 && (
        <ul className="revisao__lista" aria-live="polite">
          {estado.correcoes.map((correcao) => (
            <li key={`${correcao.campoId}-${correcao.inicio}-${correcao.trecho}`} className="revisao__item">
              <p className="revisao__campo">{rotuloCampo(correcao.campoId, form.valores)}</p>
              <p>
                <s className="revisao__trecho">{correcao.trecho}</s> {correcao.mensagem}
              </p>
              <div className="revisao__sugestoes">
                {correcao.sugestoes.map((sugestao) => (
                  <Button key={sugestao} variant="secondary" size="sm" onClick={() => resolver(correcao, sugestao)}>
                    {sugestao}
                  </Button>
                ))}
                <Button variant="ghost" size="sm" onClick={() => resolver(correcao)}>
                  Ignorar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
