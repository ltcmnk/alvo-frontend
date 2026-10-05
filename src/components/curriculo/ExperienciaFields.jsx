import Button from '../common/Button'
import FormField from '../common/FormField'
import './ExperienciaFields.css'

/** Cargo, empresa e período: ficam lado a lado a partir do tablet. */
function CamposPrincipais({ experiencia, alterar }) {
  return (
    <div className="experiencia__campos">
      <FormField label="Cargo" name="cargo" value={experiencia.cargo} onChange={alterar('cargo')} obrigatorio />
      <FormField
        label="Empresa"
        name="empresa"
        value={experiencia.empresa}
        onChange={alterar('empresa')}
        obrigatorio
      />
      <FormField
        label="Período"
        name="periodo"
        placeholder="Ex.: 2022–2024"
        value={experiencia.periodo}
        onChange={alterar('periodo')}
      />
    </div>
  )
}

/** Campos de uma experiência, com botão para removê-la. */
function ItemExperiencia({ experiencia, numero, erro, aoAlterar, aoRemover }) {
  // Cria um onChange por campo sem repetir a mesma arrow function três vezes
  const alterar = (campo) => (evento) => aoAlterar(experiencia.chave, campo, evento.target.value)

  return (
    <div className="experiencia">
      <div className="experiencia__topo">
        <p className="experiencia__titulo">Experiência {numero}</p>
        <Button variant="ghost" size="sm" onClick={() => aoRemover(experiencia.chave)}>
          Remover
        </Button>
      </div>
      <CamposPrincipais experiencia={experiencia} alterar={alterar} />
      <FormField
        as="textarea"
        label="O que você fez e qual foi o resultado"
        name="descricao"
        rows={3}
        hint="Números ajudam: %, R$, prazos, quantidade de usuários."
        value={experiencia.descricao}
        onChange={alterar('descricao')}
      />
      {erro && <p className="experiencia__erro">{erro}</p>}
    </div>
  )
}

/**
 * Lista editável de experiências profissionais do formulário de currículo.
 * @param {object} props
 * @param {{chave: number, cargo: string, empresa: string, periodo: string, descricao: string}[]} props.experiencias
 * @param {Record<string, string>} props.erros - Erros por "experiencia-<chave>".
 * @param {(chave: number, campo: string, valor: string) => void} props.aoAlterar
 * @param {() => void} props.aoAdicionar
 * @param {(chave: number) => void} props.aoRemover
 */
export default function ExperienciaFields({ experiencias, erros, aoAlterar, aoAdicionar, aoRemover }) {
  return (
    <div className="experiencias">
      {experiencias.length === 0 && (
        <p className="experiencias__vazio">Estágios, freelas e projetos acadêmicos também contam.</p>
      )}
      {experiencias.map((experiencia, indice) => (
        <ItemExperiencia
          key={experiencia.chave}
          experiencia={experiencia}
          numero={indice + 1}
          erro={erros[`experiencia-${experiencia.chave}`]}
          aoAlterar={aoAlterar}
          aoRemover={aoRemover}
        />
      ))}
      <Button variant="secondary" onClick={aoAdicionar}>
        Adicionar experiência
      </Button>
    </div>
  )
}
