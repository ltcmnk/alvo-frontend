import './LoadingSpinner.css'

/**
 * Indicador de carregamento acessível (anunciado por leitores de tela).
 * @param {object} props
 * @param {string} [props.label='Carregando…'] - Texto exibido ao lado do indicador.
 */
export default function LoadingSpinner({ label = 'Carregando…' }) {
  return (
    <div className="loading-spinner" role="status">
      <span className="loading-spinner__circulo" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}