import { Link } from 'react-router-dom'
import './Button.css'

/**
 * Botão do design system. Com `to`, vira um link do React Router com a mesma aparência,
 * para que navegação e ação tenham o mesmo visual sem duplicar estilos.
 * @param {object} props
 * @param {'primary'|'escuro'|'secondary'|'ghost'|'perigo'} [props.variant='primary'] -
 *   primary = sálvia (ação principal da tela) · escuro = ação de IA, com a bolinha sálvia do protótipo
 *   · secondary = branco com borda · ghost = só texto · perigo = ações destrutivas.
 * @param {'md'|'sm'} [props.size='md'] - Tamanho.
 * @param {string} [props.to] - Rota interna; quando informada, renderiza um <Link>.
 * @param {boolean} [props.fullWidth=false] - Ocupa toda a largura disponível.
 * @param {'button'|'submit'} [props.type='button'] - Tipo do <button>.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  fullWidth = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = ['button', `button--${variant}`, `button--${size}`, fullWidth && 'button--full', className]
    .filter(Boolean)
    .join(' ')
  const conteudo = (
    <>
      {variant === 'escuro' && <span className="button__ponto" aria-hidden="true" />}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {conteudo}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {conteudo}
    </button>
  )
}
