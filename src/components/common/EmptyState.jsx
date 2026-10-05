import './EmptyState.css'

/**
 * Mensagem para listas vazias ou falhas, sempre com um próximo passo.
 * @param {object} props
 * @param {string} props.title - O que aconteceu.
 * @param {string} [props.description] - Como resolver ou o que fazer agora.
 * @param {import('react').ReactNode} [props.action] - Botão ou link de ação.
 * @param {'neutral'|'error'} [props.tone='neutral'] - Aparência de aviso ou de erro.
 */
export default function EmptyState({ title, description, action, tone = 'neutral' }) {
  return (
    <div className={`empty-state empty-state--${tone}`} role={tone === 'error' ? 'alert' : undefined}>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}