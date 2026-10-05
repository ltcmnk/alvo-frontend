import { NavLink } from 'react-router-dom'
import './Navigation.css'

const LINKS = [
  { para: '/', rotulo: 'Início', exato: true },
  { para: '/curriculos', rotulo: 'Currículos' },
  { para: '/otimizar', rotulo: 'Otimizar' },
  { para: '/vagas', rotulo: 'Candidaturas' },
]

/**
 * Links principais do app. O NavLink marca a página atual (classe "active" e aria-current).
 * @param {object} props
 * @param {boolean} props.aberto - No celular, controla se o menu aparece.
 * @param {() => void} props.aoNavegar - Chamado no clique, para fechar o menu no celular.
 */
export default function Navigation({ aberto, aoNavegar }) {
  return (
    <nav
      id="navegacao-principal"
      className={`navigation${aberto ? ' navigation--aberta' : ''}`}
      aria-label="Navegação principal"
    >
      <ul className="navigation__lista">
        {LINKS.map((link) => (
          <li key={link.para}>
            <NavLink to={link.para} end={link.exato} className="navigation__link" onClick={aoNavegar}>
              {link.rotulo}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}