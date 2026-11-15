import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import api, { extrairMensagemErro } from '../services/api'
import { useSessao } from '../services/sessao'
import './Conta.css'

export default function Conta() {
  const { usuario, setUsuario, sair } = useSessao()
  const navegar = useNavigate()
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  async function executar(acao) {
    setErro(''); setMensagem(''); setEnviando(true)
    try { await acao() } catch (e) { setErro(extrairMensagemErro(e)) }
    finally { setEnviando(false) }
  }
  function salvar(e) {
    e.preventDefault()
    const nome = new FormData(e.currentTarget).get('nome')
    executar(async () => { setUsuario((await api.patch('/auth/perfil', { nome })).data); setMensagem('Perfil atualizado.') })
  }
  function excluir(e) {
    e.preventDefault()
    const senha = new FormData(e.currentTarget).get('senha')
    if (!window.confirm('Excluir sua conta, todos os currículos e candidaturas? Esta ação não pode ser desfeita.')) return
    executar(async () => { await api.delete('/auth/conta', { data: { senha } }); setUsuario(null); navegar('/entrar', { replace: true }) })
  }
  return <section className="page container conta">
    <h1 className="page__title">Minha conta</h1>
    <p className="page__lead">{usuario.email}</p>
    <form className="conta__form" onSubmit={salvar}>
      <FormField label="Nome" name="nome" defaultValue={usuario.nome} required minLength={2} maxLength={120} autoComplete="name" />
      <Button type="submit" disabled={enviando}>Salvar perfil</Button>
    </form>
    {mensagem && <p role="status">{mensagem}</p>}
    {erro && <p role="alert" className="conta__erro">{erro}</p>}
    <Button variant="secondary" disabled={enviando} onClick={() => executar(async () => { await sair(); navegar('/entrar') })}>Sair da conta</Button>
    <hr />
    <h2>Excluir conta</h2>
    <p>Seus currículos e candidaturas serão excluídos permanentemente. Confirme sua senha para continuar.</p>
    <form className="conta__form" onSubmit={excluir}>
      <FormField label="Confirmar senha" name="senha" type="password" autoComplete="current-password" required maxLength={128} />
      <Button type="submit" variant="perigo" disabled={enviando}>Excluir minha conta</Button>
    </form>
  </section>
}
