import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import api from '../services/api'
import { ContextoSessao, useSessao } from '../services/sessao'

/**
 * Guarda o usuário logado para o app inteiro. A sessão fica num cookie HttpOnly que o
 * navegador manda sozinho; aqui só perguntamos à API quem está logado (GET /auth/sessao).
 */
export function Sessao({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  /** Pergunta à API quem está logado. 401 só significa "não está logado"; outro erro é falha de conexão. */
  const buscarSessao = () =>
    api.get('/auth/sessao').then(
      (resposta) => ({ usuario: resposta.data, erro: false }),
      (e) => ({ usuario: null, erro: e.response?.status !== 401 }),
    )

  // Botão "Tentar de novo" da RotaProtegida
  async function carregar() {
    setCarregando(true)
    const resultado = await buscarSessao()
    setUsuario(resultado.usuario)
    setErro(resultado.erro)
    setCarregando(false)
  }

  useEffect(() => {
    let ativo = true
    buscarSessao().then((resultado) => {
      if (!ativo) return
      setUsuario(resultado.usuario)
      setErro(resultado.erro)
      setCarregando(false)
    })
    // Disparado pelo interceptor do api.js quando a sessão expira no meio do uso
    const expirar = () => setUsuario(null)
    window.addEventListener('alvo:sessao-expirada', expirar)
    return () => {
      ativo = false
      window.removeEventListener('alvo:sessao-expirada', expirar)
    }
  }, [])

  async function sair() {
    await api.post('/auth/sair')
    setUsuario(null)
  }

  return (
    <ContextoSessao.Provider value={{ usuario, setUsuario, carregando, erro, carregar, sair }}>
      {children}
    </ContextoSessao.Provider>
  )
}

/** Envolve as rotas que exigem login; sem sessão, manda para /entrar e volta depois. */
export function RotaProtegida() {
  const { usuario, carregando, erro, carregar } = useSessao()
  const local = useLocation()
  if (carregando) return <p className="container" role="status">Carregando sua conta…</p>
  if (erro) {
    return (
      <div className="container">
        <p role="alert">Não foi possível verificar sua sessão.</p>
        <button onClick={carregar}>Tentar de novo</button>
      </div>
    )
  }
  return usuario ? <Outlet key={usuario.id} /> : <Navigate to="/entrar" state={{ voltar: local.pathname + local.search }} replace />
}
