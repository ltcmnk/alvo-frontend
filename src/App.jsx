import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CriarCurriculo from './pages/CriarCurriculo'
import Curriculos from './pages/Curriculos'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Otimizar from './pages/Otimizar'
import Vagas from './pages/Vagas'
import './styles/App.css'

/** Mapa de rotas do app. A rota "*" captura qualquer endereço desconhecido. */
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curriculos" element={<Curriculos />} />
            <Route path="/curriculos/novo" element={<CriarCurriculo />} />
            <Route path="/otimizar" element={<Otimizar />} />
            <Route path="/vagas" element={<Vagas />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App