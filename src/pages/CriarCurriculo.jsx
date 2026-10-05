import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'

// Página provisória: a rota já navega; o conteúdo chega no card "[FEAT] Página Criar currículo" do Trello.
export default function CriarCurriculo() {
  return (
    <section className="page container">
      <header className="page__header">
        <h1 className="page__title">Criar currículo</h1>
      </header>
      <EmptyState
        title="Página em construção"
        description="O formulário de currículo chega ainda nesta sprint."
        action={<Button to="/">Voltar para o início</Button>}
      />
    </section>
  )
}