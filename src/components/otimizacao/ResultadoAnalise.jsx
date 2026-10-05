import Card from '../common/Card'
import './ResultadoAnalise.css'

/** Grupo de palavras-chave em formato de etiquetas. */
function GrupoPalavras({ titulo, palavras, tipo }) {
  if (palavras.length === 0) return null
  return (
    <div className="resultado__grupo">
      <h3 className="resultado__subtitulo">{titulo}</h3>
      <ul className="resultado__palavras">
        {palavras.map((palavra) => (
          <li key={palavra} className={`resultado__palavra resultado__palavra--${tipo}`}>
            {palavra}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Relatório de compatibilidade entre currículo e vaga (US04 e US05).
 * @param {object} props
 * @param {{ percentual: number, encontradas: string[], faltantes: string[], sugestoes: string[] }} props.resultado
 */
export default function ResultadoAnalise({ resultado }) {
  const { percentual, encontradas, faltantes, sugestoes } = resultado

  return (
    <Card as="section" className="resultado" aria-live="polite">
      <div className="resultado__placar">
        <p className="resultado__percentual">{percentual}%</p>
        <p className="resultado__legenda">das palavras-chave da vaga aparecem no seu currículo</p>
      </div>
      <div className="resultado__barra" aria-hidden="true">
        <span style={{ width: `${percentual}%` }} />
      </div>

      <GrupoPalavras titulo="Já estão no currículo" palavras={encontradas} tipo="encontrada" />
      <GrupoPalavras titulo="Faltam no currículo" palavras={faltantes} tipo="faltante" />

      <div className="resultado__grupo">
        <h3 className="resultado__subtitulo">Sugestões de melhoria</h3>
        <ul className="resultado__sugestoes">
          {sugestoes.map((sugestao) => (
            <li key={sugestao}>{sugestao}</li>
          ))}
        </ul>
      </div>

      <p className="resultado__aviso">
        Análise por palavras-chave feita no navegador. A análise com IA chega nas próximas sprints.
      </p>
    </Card>
  )
}
