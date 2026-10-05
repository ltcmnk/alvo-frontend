import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CriarCurriculo from './pages/CriarCurriculo'
import Curriculos from './pages/Curriculos'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Otimizar from './pages/Otimizar'
import Vagas from './pages/Vagas'
import './styles/App.css'

/**
 * Mapa de rotas do app. Todas ficam dentro do Layout (cabeçalho e rodapé)
 * e a rota "*" captura qualquer endereço desconhecido.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/curriculos" element={<Curriculos />} />
          <Route path="/curriculos/novo" element={<CriarCurriculo />} />
          <Route path="/otimizar" element={<Otimizar />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App