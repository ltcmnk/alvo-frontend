import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from './Navigation'
import './Header.css'

/** Símbolo da marca: três anéis concêntricos com o centro em sálvia. */
function SimboloAlvo() {
  return (
    <svg className="header__simbolo" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="3.5" fill="var(--cor-salvia)" />
    </svg>
  )
}

/** Cabeçalho fixo com logo e navegação; no celular, a navegação abre por um botão de menu. */
export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const fecharMenu = useCallback(() => setMenuAberto(false), [])

  return (
    <header className="header">
      <div className="container header__barra">
        <Link to="/" className="header__logo" onClick={fecharMenu}>
          <SimboloAlvo />
          alvo
        </Link>
        <button
          type="button"
          className="header__menu"
          aria-expanded={menuAberto}
          aria-controls="navegacao-principal"
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
          <span className="header__menu-icone" aria-hidden="true" />
        </button>
        <Navigation aberto={menuAberto} aoNavegar={fecharMenu} />
      </div>
    </header>
  )
}