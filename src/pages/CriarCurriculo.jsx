import Button from '../components/common/Button'
import FormularioCurriculo from '../components/curriculo/FormularioCurriculo'
import LeitorArquivo from '../components/curriculo/LeitorArquivo'
import MensagemEnvio from '../components/curriculo/MensagemEnvio'
import PainelPrevia from '../components/curriculo/PainelPrevia'
import useFormCurriculo from '../hooks/useFormCurriculo'
import { curriculoVazio, paraFormulario } from '../utils/curriculo'
import './CriarCurriculo.css'

/** Página de criação de currículo: formulário completo à esquerda e prévia ao vivo à direita (US01–US03). */
export default function CriarCurriculo() {
  const form = useFormCurriculo()
  const enviando = form.envio.status === 'enviando'

  // Depois de salvar, limpa o formulário para o próximo clique não criar uma cópia
  async function salvar(evento) {
    const salvo = await form.enviar(evento)
    if (salvo) form.substituir(curriculoVazio())
  }

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <p className="page__rotulo">Novo currículo</p>
          <h1 className="page__title">Criar currículo</h1>
          <p className="page__lead">
            Quanto mais completo, melhor a IA consegue destacar o que você já fez. Campos com * são obrigatórios.
          </p>
        </div>
      </header>
      <LeitorArquivo aoUsar={(curriculo) => form.substituir(paraFormulario(curriculo))} />
      <div className="criar-curriculo">
        <form className="criar-curriculo__form" onSubmit={salvar} noValidate>
          <FormularioCurriculo form={form} />
          <MensagemEnvio envio={form.envio} />
          <Button type="submit" disabled={enviando} fullWidth>
            {enviando ? 'Salvando…' : 'Salvar currículo'}
          </Button>
        </form>
        <PainelPrevia valores={form.valores} />
      </div>
    </section>
  )
}
