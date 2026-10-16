import './Acordeao.css'

/**
 * Seção que abre e fecha, feita com <details> nativo: acessível por teclado sem JavaScript.
 * @param {object} props
 * @param {string} props.titulo
 * @param {boolean} [props.aberto=false] - Começa aberto.
 * @param {import('react').ReactNode} [props.extra] - Conteúdo à direita do título (ex.: contagem).
 */
export default function Acordeao({ titulo, aberto = false, extra, children }) {
  return (
    <details className="acordeao" open={aberto}>
      <summary className="acordeao__titulo">
        <span>{titulo}</span>
        {extra && <span className="acordeao__extra">{extra}</span>}
        <span className="acordeao__icone" aria-hidden="true" />
      </summary>
      <div className="acordeao__conteudo">{children}</div>
    </details>
  )
}
