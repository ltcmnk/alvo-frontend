import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import './Layout.css'

/** Moldura comum a todas as rotas: cabeçalho, conteúdo da página atual e rodapé. */
export default function Layout() {
  const { pathname } = useLocation()

  // Num SPA a rolagem não volta ao topo sozinha ao trocar de página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="app__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}