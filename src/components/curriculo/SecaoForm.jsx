import Card from '../common/Card'
import './SecaoForm.css'

/**
 * Bloco do formulário com título e orientação; agrupa campos relacionados.
 * @param {object} props
 * @param {string} props.titulo
 * @param {string} [props.descricao] - Dica curta de como preencher a seção.
 */
export default function SecaoForm({ titulo, descricao, children }) {
  return (
    <Card as="fieldset" className="secao-form">
      <legend className="secao-form__titulo">{titulo}</legend>
      {descricao && <p className="secao-form__descricao">{descricao}</p>}
      <div className="secao-form__campos">{children}</div>
    </Card>
  )
}
