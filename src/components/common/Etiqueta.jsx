import './Etiqueta.css'

/**
 * Pílula de texto curto (tipo de currículo, categoria, prioridade).
 * @param {object} props
 * @param {'neutro'|'salvia'|'manteiga'|'azul'|'lavanda'|'erro'} [props.tom='neutro'] - Cor da pílula.
 */
export default function Etiqueta({ tom = 'neutro', className = '', children }) {
  return <span className={`etiqueta etiqueta--${tom} ${className}`.trim()}>{children}</span>
}
