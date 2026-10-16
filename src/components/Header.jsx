import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './common/Button'
import Navigation from './Navigation'
import './Header.css'

/** Símbolo da marca: dois anéis com o centro em sálvia, igual ao favicon. */
function SimboloAlvo() {
  return (
    <svg className="header__simbolo" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="20" cy="20" r="3.6" fill="var(--cor-salvia)" />
    </svg>
  )
}

/** Barra superior fixa: logo, abas e atalho para otimizar; no celular, as abas abrem por um botão. */
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
        <Navigation aberto={menuAberto} aoNavegar={fecharMenu} />
        <div className="header__acoes">
          <Button to="/otimizar" size="sm" className="header__cta" onClick={fecharMenu}>
            <span className="header__cta-ponto" aria-hidden="true" />
            Otimizar currículo
          </Button>
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
        </div>
      </div>
    </header>
  )
}
