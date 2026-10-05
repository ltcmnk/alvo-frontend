import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'

// Página provisória: a rota já navega; o conteúdo chega no card "[FEAT] Página Vagas" do Trello.
export default function Vagas() {
  return (
    <section className="page container">
      <header className="page__header">
        <h1 className="page__title">Candidaturas</h1>
      </header>
      <EmptyState
        title="Página em construção"
        description="O acompanhamento de candidaturas chega ainda nesta sprint."
        action={<Button to="/">Voltar para o início</Button>}
      />
    </section>
  )
}