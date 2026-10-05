import { separarHabilidades } from '../../utils/separarHabilidades'
import './PreviaCurriculo.css'

/** Uma seção da prévia; não aparece enquanto não houver conteúdo. */
function SecaoPrevia({ titulo, children }) {
  return (
    <section className="previa__secao">
      <h3 className="previa__secao-titulo">{titulo}</h3>
      {children}
    </section>
  )
}

/** Lista de experiências já preenchidas (as vazias ficam de fora). */
function ExperienciasPrevia({ experiencias }) {
  const preenchidas = experiencias.filter((item) => item.cargo.trim() || item.empresa.trim())
  if (preenchidas.length === 0) return null

  return (
    <SecaoPrevia titulo="Experiência">
      {preenchidas.map((item) => (
        <div key={item.chave} className="previa__experiencia">
          <p className="previa__destaque">
            {item.cargo || 'Cargo'} · {item.empresa || 'Empresa'}
            {item.periodo && <span className="previa__periodo"> ({item.periodo})</span>}
          </p>
          {item.descricao && <p>{item.descricao}</p>}
        </div>
      ))}
    </SecaoPrevia>
  )
}

/**
 * Prévia do currículo, atualizada enquanto o usuário digita (US03).
 * @param {object} props
 * @param {object} props.valores - Estado atual do formulário.
 */
export default function PreviaCurriculo({ valores }) {
  const habilidades = separarHabilidades(valores.habilidades)

  return (
    <aside className="previa" aria-label="Prévia do currículo">
      <p className="previa__rotulo">Prévia</p>
      <div className="previa__documento">
        <p className="previa__nome">{valores.nome || 'Seu nome'}</p>
        <p className="previa__cargo">{valores.cargoAlvo || 'Cargo que você busca'}</p>
        {valores.email && <p className="previa__contato">{valores.email}</p>}
        {valores.resumo && (
          <SecaoPrevia titulo="Resumo">
            <p>{valores.resumo}</p>
          </SecaoPrevia>
        )}
        <ExperienciasPrevia experiencias={valores.experiencias} />
        {valores.formacao && (
          <SecaoPrevia titulo="Formação">
            <p>{valores.formacao}</p>
          </SecaoPrevia>
        )}
        {habilidades.length > 0 && (
          <SecaoPrevia titulo="Habilidades">
            <p>{habilidades.join(', ')}</p>
          </SecaoPrevia>
        )}
      </div>
    </aside>
  )
}
