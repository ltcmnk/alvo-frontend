import { useState } from 'react'
import BarraProgresso from '../common/BarraProgresso'
import Button from '../common/Button'
import './PreviaAts.css'

const ROTULO_STATUS = { ok: 'Lido', atencao: 'Vale incluir', ausente: 'Não encontrado' }

/** Nota ATS de 0 a 100 com a nota de cada critério e as dicas. */
function NotaAts({ pontuacao }) {
  const dicas = pontuacao.criterios.flatMap((criterio) => criterio.dicas)
  return (
    <div className="previa-ats__bloco">
      <p className="titulo-bloco">Nota ATS</p>
      <p className="numero-destaque">
        {pontuacao.total}
        <small>/100</small>
      </p>
      <div className="previa-ats__criterios">
        {pontuacao.criterios.map((criterio) => (
          <BarraProgresso key={criterio.id} rotulo={`${criterio.nome} (peso ${criterio.peso})`} valor={criterio.nota} />
        ))}
      </div>
      {dicas.length > 0 && (
        <ul className="previa-ats__dicas">
          {dicas.map((dica) => (
            <li key={dica}>{dica}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Campos que um ATS costuma extrair, com o que ele encontrou em cada um. */
function CamposLidos({ campos }) {
  return (
    <div className="previa-ats__bloco">
      <p className="titulo-bloco">O que o ATS extrai</p>
      <dl className="previa-ats__campos">
        {campos.map((campo) => (
          <div key={campo.campo} className={`previa-ats__campo previa-ats__campo--${campo.status}`}>
            <dt>{campo.campo}</dt>
            <dd>{campo.valor ?? ROTULO_STATUS[campo.status]}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Texto puro na ordem de leitura do ATS, com botão de copiar. */
function TextoPuro({ texto }) {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }
  return (
    <div className="previa-ats__bloco">
      <div className="previa-ats__topo-texto">
        <p className="titulo-bloco">Como o ATS lê o documento</p>
        <Button variant="secondary" size="sm" onClick={copiar}>
          {copiado ? 'Copiado!' : 'Copiar texto'}
        </Button>
      </div>
      <pre className="previa-ats__texto">{texto}</pre>
    </div>
  )
}

/**
 * Prévia de como um ATS lê o currículo: nota, ordem das seções, campos extraídos, alertas e texto puro.
 * @param {object} props
 * @param {import('../../services/documentoService').LeituraAts} props.leitura
 * @param {object} [props.pontuacao] - Nota a exibir (padrão: a da própria leitura).
 */
export default function PreviaAts({ leitura, pontuacao = leitura.pontuacao }) {
  return (
    <div className="previa-ats">
      {pontuacao && <NotaAts pontuacao={pontuacao} />}
      <p className="previa-ats__ordem">{leitura.ordem.motivo}</p>
      {leitura.alertas.length > 0 && (
        <div className="previa-ats__alertas" role="status">
          <p className="titulo-bloco">Pode atrapalhar a leitura</p>
          <ul>
            {leitura.alertas.map((alerta) => (
              <li key={alerta}>{alerta}</li>
            ))}
          </ul>
        </div>
      )}
      <CamposLidos campos={leitura.campos} />
      <TextoPuro texto={leitura.texto} />
    </div>
  )
}
