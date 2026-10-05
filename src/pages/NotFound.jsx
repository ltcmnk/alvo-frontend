import Button from '../components/common/Button'
import './NotFound.css'

/** Página 404: qualquer rota que não existe cai aqui. */
export default function NotFound() {
  return (
    <section className="page container not-found">
      <p className="not-found__codigo" aria-hidden="true">
        404
      </p>
      <h1 className="not-found__titulo">Essa página saiu do alvo.</h1>
      <p className="not-found__texto">
        O endereço pode ter mudado ou nunca ter existido. Volte para o início e continue de onde
        parou.
      </p>
      <Button to="/">Voltar para o início</Button>
    </section>
  )
}