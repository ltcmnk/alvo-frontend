import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'

/** Editor de currículo: rota reservada; a página completa entra na branch feat/editor-curriculo. */
export default function EditorCurriculo() {
  return (
    <section className="page container">
      <EmptyState
        title="Editor em construção"
        description="Aqui você vai revisar o currículo gerado pela IA, corrigir a ortografia e exportar em PDF, DOCX ou LaTeX."
        action={<Button to="/curriculos">Ver meus currículos</Button>}
      />
    </section>
  )
}
