import Button from '../common/Button'
import './SecaoLista.css'

/**
 * Lista editável de itens (experiências, formações, projetos, idiomas, certificações).
 * Cada item tem título, botão de remover e os campos que `children` desenha.
 * @param {object} props
 * @param {{ chave: number }[]} props.itens
 * @param {(item: object, indice: number) => string} props.tituloItem
 * @param {Record<string, string>} props.erros - Erros por "<lista>-<chave>".
 * @param {string} props.lista - Nome da lista no estado do formulário.
 * @param {string} props.textoAdicionar - Rótulo do botão de adicionar.
 * @param {string} [props.vazio] - Texto quando a lista está vazia.
 * @param {() => void} props.aoAdicionar
 * @param {(chave: number) => void} props.aoRemover
 * @param {(item: object) => import('react').ReactNode} props.children - Campos de um item.
 */
export default function SecaoLista({ itens, tituloItem, erros, lista, textoAdicionar, vazio, aoAdicionar, aoRemover, children }) {
  return (
    <div className="secao-lista">
      {itens.length === 0 && vazio && <p className="secao-lista__vazio">{vazio}</p>}
      {itens.map((item, indice) => (
        <div key={item.chave} className="secao-lista__item">
          <div className="secao-lista__topo">
            <p className="secao-lista__titulo">{tituloItem(item, indice)}</p>
            <Button variant="perigo" size="sm" onClick={() => aoRemover(item.chave)}>
              Remover
            </Button>
          </div>
          {children(item)}
          {erros[`${lista}-${item.chave}`] && (
            <p className="secao-lista__erro" role="alert">
              {erros[`${lista}-${item.chave}`]}
            </p>
          )}
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={aoAdicionar}>
        + {textoAdicionar}
      </Button>
    </div>
  )
}
