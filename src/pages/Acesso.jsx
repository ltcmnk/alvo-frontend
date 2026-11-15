import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import api, { extrairMensagemErro } from '../services/api'
import { useSessao } from '../services/sessao'
import './Conta.css'

export default function Acesso({ cadastro = false }) {
  const { usuario, setUsuario, carregando } = useSessao()
  const local = useLocation()
  const navegar = useNavigate()
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const voltar = local.state?.voltar?.startsWith('/') && !local.state.voltar.startsWith('//') ? local.state.voltar : '/curriculos'
  if (carregando) return <p className="container" role="status">Carregando sua conta…</p>
  if (usuario) return <Navigate to={voltar} replace />
  async function enviar(evento) {
    evento.preventDefault()
    const dados = Object.fromEntries(new FormData(evento.currentTarget))
    setEnviando(true); setErro('')
    try {
      const resposta = await api.post(cadastro ? '/auth/cadastro' : '/auth/entrar', dados)
      setUsuario(resposta.data)
      navegar(voltar, { replace: true })
    } catch (e) { setErro(extrairMensagemErro(e)) }
    finally { setEnviando(false) }
  }
  return <section className="page container conta">
    <p className="page__rotulo">Sua trajetória, organizada</p>
    <h1 className="page__title">{cadastro ? 'Criar sua conta' : 'Entrar no Alvo'}</h1>
    <p className="page__lead">Guarde seus currículos e acompanhe suas candidaturas em um só lugar.</p>
    <form className="conta__form" onSubmit={enviar}>
      {cadastro && <FormField label="Nome" name="nome" autoComplete="name" required minLength={2} maxLength={120} />}
      <FormField label="E-mail" name="email" type="email" autoComplete="email" required maxLength={254} />
      <FormField label="Senha" name="senha" type="password" autoComplete={cadastro ? 'new-password' : 'current-password'} required minLength={10} maxLength={128} hint={cadastro ? 'Use de 10 a 128 caracteres.' : undefined} />
      {erro && <p role="alert" className="conta__erro">{erro}</p>}
      <Button type="submit" disabled={enviando} fullWidth>{enviando ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}</Button>
    </form>
    <p>{cadastro ? 'Já tem uma conta? ' : 'Primeira vez por aqui? '}<Link to={cadastro ? '/entrar' : '/cadastro'} state={{ voltar }}>{cadastro ? 'Entrar' : 'Criar conta'}</Link></p>
  </section>
}
