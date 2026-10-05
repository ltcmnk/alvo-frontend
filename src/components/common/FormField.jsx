import { useId } from 'react'
import './FormField.css'

/** Dica e erro abaixo do campo; os ids ligam o texto ao controle via aria-describedby. */
function MensagensCampo({ idDica, hint, idErro, error }) {
  return (
    <>
      {hint && (
        <p id={idDica} className="form-field__dica">
          {hint}
        </p>
      )}
      {error && (
        <p id={idErro} className="form-field__erro">
          {error}
        </p>
      )}
    </>
  )
}

/**
 * Campo de formulário com rótulo, dica e mensagem de erro ligados por id,
 * para que leitores de tela anunciem o erro junto com o campo.
 * Props extras (value, onChange, type, placeholder, rows...) vão direto para o controle.
 * @param {object} props
 * @param {string} props.label - Texto do rótulo.
 * @param {string} props.name - Nome do campo (usado no estado do formulário).
 * @param {'input'|'textarea'|'select'} [props.as='input'] - Tipo de controle.
 * @param {string} [props.hint] - Dica exibida abaixo do campo.
 * @param {string} [props.error] - Mensagem de erro; quando presente, o campo fica destacado.
 * @param {boolean} [props.obrigatorio=false] - Mostra o asterisco de campo obrigatório.
 */
export default function FormField({
  label,
  name,
  as: Controle = 'input',
  hint,
  error,
  obrigatorio = false,
  children,
  ...rest
}) {
  const id = useId()
  const idDica = hint ? `${id}-dica` : null
  const idErro = error ? `${id}-erro` : null
  const descritoPor = [idDica, idErro].filter(Boolean).join(' ') || undefined

  return (
    <div className={`form-field${error ? ' form-field--erro' : ''}`}>
      <label htmlFor={id} className="form-field__label">
        {label}
        {obrigatorio && <span aria-hidden="true"> *</span>}
      </label>
      <Controle
        id={id}
        name={name}
        className="form-field__controle"
        aria-invalid={Boolean(error)}
        aria-required={obrigatorio || undefined}
        aria-describedby={descritoPor}
        {...rest}
      >
        {children}
      </Controle>
      <MensagensCampo idDica={idDica} hint={hint} idErro={idErro} error={error} />
    </div>
  )
}
