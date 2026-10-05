import './StatusTag.css'

const ROTULOS = {
  aplicado: 'Aplicado',
  entrevista: 'Entrevista',
  oferta: 'Oferta',
  rejeitado: 'Rejeitado',
}

/**
 * Etiqueta colorida com a etapa de uma candidatura.
 * @param {object} props
 * @param {'aplicado'|'entrevista'|'oferta'|'rejeitado'} props.status - Etapa vinda da API.
 */
export default function StatusTag({ status }) {
  return <span className={`status-tag status-tag--${status}`}>{ROTULOS[status] ?? status}</span>
}