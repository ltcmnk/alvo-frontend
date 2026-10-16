import './Chip.css'

/**
 * Opção selecionável em formato de pílula (ex.: escolher o currículo base ou o provedor de IA).
 * Ativo fica preto, como os chips do protótipo.
 * @param {object} props
 * @param {boolean} props.ativo - Se está selecionado (anunciado com aria-pressed).
 * @param {() => void} props.aoClicar
 * @param {boolean} [props.disabled]
 * @param {string} [props.detalhe] - Texto menor ao lado (ex.: "sem chave").
 */
export default function Chip({ ativo, aoClicar, disabled = false, detalhe, children }) {
  return (
    <button
      type="button"
      className={`chip${ativo ? ' chip--ativo' : ''}`}
      aria-pressed={ativo}
      disabled={disabled}
      onClick={aoClicar}
    >
      {children}
      {detalhe && <span className="chip__detalhe">{detalhe}</span>}
    </button>
  )
}
