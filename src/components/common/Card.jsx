import './Card.css'

/**
 * Superfície branca arredondada usada para agrupar conteúdo.
 * @param {object} props
 * @param {string} [props.as='div'] - Tag HTML (ex.: 'article', 'section', 'li').
 * @param {boolean} [props.compact=false] - Usa menos espaçamento interno.
 */
export default function Card({ as: Tag = 'div', compact = false, className = '', children, ...rest }) {
  const classes = ['card', compact && 'card--compact', className].filter(Boolean).join(' ')
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}