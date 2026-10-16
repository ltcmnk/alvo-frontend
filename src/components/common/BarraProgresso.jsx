import './BarraProgresso.css'

/**
 * Barra com rótulo e valor (ex.: critérios da nota ATS, aderência por tipo de vaga).
 * A largura anima ao aparecer, como no protótipo.
 * @param {object} props
 * @param {string} props.rotulo
 * @param {number} props.valor - De 0 a 100.
 * @param {string} [props.texto] - O que mostrar à direita; padrão "valor%".
 * @param {string} [props.legenda] - Linha pequena abaixo da barra.
 */
export default function BarraProgresso({ rotulo, valor, texto, legenda }) {
  const largura = Math.min(100, Math.max(0, valor))
  return (
    <div className="barra-progresso">
      <div className="barra-progresso__topo">
        <span>{rotulo}</span>
        <span className="barra-progresso__valor">{texto ?? `${Math.round(largura)}%`}</span>
      </div>
      <div
        className="barra-progresso__trilho"
        role="progressbar"
        aria-label={rotulo}
        aria-valuenow={Math.round(largura)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${largura}%` }} />
      </div>
      {legenda && <p className="barra-progresso__legenda">{legenda}</p>}
    </div>
  )
}
