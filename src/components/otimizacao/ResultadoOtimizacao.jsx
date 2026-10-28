import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Acordeao from '../common/Acordeao'
import BarraProgresso from '../common/BarraProgresso'
import Button from '../common/Button'
import Card from '../common/Card'
import Etiqueta from '../common/Etiqueta'
import PreviaAts from '../curriculo/PreviaAts'
import { extrairMensagemErro } from '../../services/api'
import { criarCurriculo } from '../../services/curriculoService'
import RegistrarCandidatura from './RegistrarCandidatura'
import './ResultadoOtimizacao.css'

const ANALISE = [
  ['reorganizado', 'Reorganizado'],
  ['destaque', 'Ganhou destaque'],
  ['descricoesFortalecidas', 'Descrições fortalecidas'],
  ['leituraAts', 'Leitura por ATS'],
  ['leituraHumana', 'Leitura humana'],
  ['omitido', 'Omitido por falta de dados'],
]

/** "62 → 88 (+26)": a nota ATS antes e depois, como no protótipo. */
function Placar({ resultado }) {
  const { notaAntes, notaDepois, compatibilidade } = resultado
  const ganho = notaDepois.total - notaAntes.total
  return (
    <div className="resultado-otim__placar">
      <div>
        <p className="resultado-otim__rotulo">Antes</p>
        <p className="numero-destaque resultado-otim__antes">{notaAntes.total}</p>
      </div>
      <span className="resultado-otim__seta" aria-hidden="true">→</span>
      <div>
        <p className="resultado-otim__rotulo">Depois</p>
        <p className="numero-destaque">{notaDepois.total}</p>
      </div>
      <Etiqueta tom={ganho > 0 ? 'salvia' : 'neutro'}>{ganho > 0 ? `+${ganho} pontos` : 'Mesma nota'}</Etiqueta>
      {compatibilidade && (
        <p className="resultado-otim__compat">
          Palavras-chave da vaga: <strong>{compatibilidade.antes}%</strong> → <strong>{compatibilidade.depois}%</strong>
        </p>
      )}
    </div>
  )
}

/** Avisos da trava de fatos: o que foi descartado e os números que o usuário precisa conferir. */
function AvisosTrava({ travas }) {
  if (!travas.removidos.length && !travas.numerosParaConferir.length) return null
  return (
    <div className="resultado-otim__trava" role="status">
      <p className="titulo-bloco">Trava de fatos</p>
      {travas.removidos.length > 0 && (
        <p>Removemos o que não estava no seu currículo original: {travas.removidos.join(', ')}.</p>
      )}
      {travas.numerosParaConferir.length > 0 && (
        <p>
          Confira no editor se estes números são reais: <strong>{travas.numerosParaConferir.join(', ')}</strong>. Se não forem, apague.
        </p>
      )}
    </div>
  )
}

function Lista({ itens, marcador = '→' }) {
  return (
    <ul className="resultado-otim__lista">
      {itens.map((item) => (
        <li key={item}>
          <span aria-hidden="true">{marcador}</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Análise completa da IA em accordions, como no protótipo. */
function Analises({ resultado }) {
  return (
    <div className="resultado-otim__acordeoes">
      <Acordeao titulo="Análise das melhorias">
        {ANALISE.map(([campo, rotulo]) => (
          <p key={campo}>
            <strong>{rotulo}:</strong> {resultado.analiseMelhorias[campo]}
          </p>
        ))}
      </Acordeao>
      <Acordeao titulo="Palavras-chave identificadas">
        {resultado.palavrasChave.map((grupo) => (
          <div key={grupo.categoria}>
            <p className="resultado-otim__categoria">{grupo.categoria}</p>
            <div className="resultado-otim__etiquetas">
              {grupo.termos.map((termo) => (
                <Etiqueta key={termo} tom="azul">
                  {termo}
                </Etiqueta>
              ))}
            </div>
          </div>
        ))}
      </Acordeao>
      <Acordeao titulo="Sugestões de melhorias futuras">
        <p>Não foram colocadas no currículo: dependem de você.</p>
        <Lista itens={resultado.sugestoesFuturas} />
      </Acordeao>
      {resultado.aderencia.length > 0 && (
        <Acordeao titulo="Estimativa de aderência ATS">
          {resultado.aderencia.map((item) => (
            <BarraProgresso key={item.tipoVaga} rotulo={item.tipoVaga} valor={parseInt(item.faixa, 10) || 0} texto={item.faixa} legenda={item.motivo} />
          ))}
          <p className="resultado-otim__nota">
            Estimativas com base nas informações do currículo. Não são garantia de aprovação ou entrevista.
          </p>
        </Acordeao>
      )}
      {resultado.riscos.length > 0 && (
        <Acordeao titulo="Riscos e lacunas">
          <Lista itens={resultado.riscos} marcador="!" />
        </Acordeao>
      )}
      <Acordeao titulo="Como o ATS lê a nova versão">
        <PreviaAts leitura={resultado.leituraAts} pontuacao={resultado.notaDepois} />
      </Acordeao>
    </div>
  )
}

/**
 * Resultado da otimização: nota antes/depois, ajustes, análise da IA e as ações
 * de revisar no editor, salvar e registrar a candidatura.
 * @param {object} props
 * @param {object} props.resultado - Resposta de POST /api/ia/otimizar.
 * @param {object} props.original - Currículo salvo que foi otimizado.
 * @param {object|null} props.analiseVaga - Análise automática da vaga (se houver vaga).
 * @param {string} [props.descricaoVaga]
 * @param {() => void} props.aoRecomecar
 */
export default function ResultadoOtimizacao({ resultado, original, analiseVaga, descricaoVaga, aoRecomecar }) {
  const navigate = useNavigate()
  const [salvo, setSalvo] = useState(null)
  const [erro, setErro] = useState('')
  const vagaAlvo = analiseVaga
    ? { cargo: analiseVaga.cargo?.slice(0, 120), compatibilidade: resultado.compatibilidade?.depois }
    : undefined
  const extras = { tipo: analiseVaga ? 'sob-medida' : 'otimizado', origemId: original.id, vagaAlvo }

  async function salvar() {
    setErro('')
    try {
      setSalvo(await criarCurriculo({ ...resultado.curriculo, ...extras }))
    } catch (falha) {
      setErro(extrairMensagemErro(falha))
    }
  }

  return (
    <Card as="section" className="resultado-otim" aria-live="polite">
      <Placar resultado={resultado} />
      <p className="titulo-bloco">O que {resultado.modo === 'ia' ? 'a IA' : 'o modo demonstração'} ajustou</p>
      <Lista itens={resultado.mudancas} marcador="✓" />
      <AvisosTrava travas={resultado.travas} />
      <Analises resultado={resultado} />
      {erro && (
        <p className="mensagem-envio mensagem-envio--erro" role="alert">
          {erro}
        </p>
      )}
      {salvo ? (
        <>
          <div className="mensagem-envio mensagem-envio--sucesso" role="status">
            <p>Versão salva nos seus currículos com nota ATS {salvo.pontuacao}/100.</p>
            <div className="mensagem-envio__acoes">
              <Button to={`/curriculos/${salvo.id}/editar`} variant="secondary" size="sm">
                Abrir no editor
              </Button>
              <Button to="/curriculos" variant="secondary" size="sm">
                Ver meus currículos
              </Button>
            </div>
          </div>
          <RegistrarCandidatura
            curriculoId={salvo.id}
            compatibilidade={resultado.compatibilidade?.depois}
            cargoSugerido={analiseVaga?.cargo}
            descricaoVaga={descricaoVaga}
          />
        </>
      ) : (
        <div className="resultado-otim__acoes">
          <Button onClick={() => navigate('/curriculos/editar', { state: { curriculo: resultado.curriculo, extras } })}>
            Revisar e editar antes de salvar
          </Button>
          <Button variant="secondary" onClick={salvar}>
            Salvar sem editar
          </Button>
          <Button variant="ghost" onClick={aoRecomecar}>
            Otimizar outro
          </Button>
        </div>
      )}
    </Card>
  )
}
