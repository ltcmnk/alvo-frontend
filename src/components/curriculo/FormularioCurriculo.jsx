import FormField from '../common/FormField'
import { CamposCertificacao, CamposExperiencia, CamposFormacao, CamposIdioma, CamposProjeto } from './CamposItem'
import SecaoForm from './SecaoForm'
import SecaoLista from './SecaoLista'
import './FormularioCurriculo.css'

const LIMITE_RESUMO = 800

/** Cria o onChange de um campo do item: `alterar('cargo')`. Checkbox manda true/false. */
const criarAlterar = (aoAlterar, lista, item) => (campo) => (evento) => {
  const { type, checked, value } = evento.target
  aoAlterar(lista, item.chave, campo, type === 'checkbox' ? checked : value)
}

/** Configuração das seções em lista: título, textos e os campos de cada item. */
const LISTAS = [
  {
    lista: 'experiencias',
    titulo: 'Experiência profissional',
    descricao: 'Empregos, estágios, freelas e trabalhos temporários. Comece pelo mais recente.',
    adicionar: 'Adicionar experiência',
    tituloItem: (item, i) => item.cargo || `Experiência ${i + 1}`,
    Campos: CamposExperiencia,
  },
  {
    lista: 'formacoes',
    titulo: 'Formação acadêmica',
    descricao: 'Graduação, técnico, pós ou ensino médio, se for o seu caso.',
    adicionar: 'Adicionar formação',
    tituloItem: (item, i) => item.curso || `Formação ${i + 1}`,
    Campos: CamposFormacao,
  },
  {
    lista: 'projetos',
    titulo: 'Projetos',
    descricao: 'Projetos acadêmicos, pessoais e voluntários contam como experiência prática. A IA vai valorizá-los.',
    adicionar: 'Adicionar projeto',
    tituloItem: (item, i) => item.nome || `Projeto ${i + 1}`,
    Campos: CamposProjeto,
  },
  {
    lista: 'idiomas',
    titulo: 'Idiomas',
    adicionar: 'Adicionar idioma',
    tituloItem: (item, i) => item.idioma || `Idioma ${i + 1}`,
    Campos: CamposIdioma,
  },
  {
    lista: 'certificacoes',
    titulo: 'Certificações e cursos',
    adicionar: 'Adicionar certificação',
    tituloItem: (item, i) => item.nome || `Certificação ${i + 1}`,
    Campos: CamposCertificacao,
  },
]

/** Contatos e cargo-alvo: nome e cargo são obrigatórios também na API. */
function SecaoContato({ valores, erros, aoAlterar }) {
  const campo = (name, label, extras = {}) => (
    <FormField label={label} name={name} value={valores[name]} onChange={aoAlterar} error={erros[name]} {...extras} />
  )
  return (
    <SecaoForm titulo="Dados pessoais" descricao="Não inclua CPF, RG, idade, estado civil ou foto: o ATS não precisa e a LGPD agradece.">
      <div className="campos-duplos">
        {campo('nome', 'Nome completo', { autoComplete: 'name', obrigatorio: true })}
        {campo('cargoAlvo', 'Cargo que você busca', { placeholder: 'Ex.: Analista Financeiro Júnior', obrigatorio: true })}
        {campo('email', 'E-mail', { type: 'email', autoComplete: 'email' })}
        {campo('telefone', 'Telefone', { type: 'tel', autoComplete: 'tel', placeholder: '(11) 91234-5678' })}
        {campo('cidade', 'Cidade', { placeholder: 'Ex.: Recife, PE', autoComplete: 'address-level2' })}
        {campo('linkedin', 'LinkedIn', { type: 'url', placeholder: 'https://linkedin.com/in/voce' })}
        {campo('github', 'GitHub', { type: 'url', placeholder: 'https://github.com/voce' })}
        {campo('portfolio', 'Portfólio ou site', { type: 'url', placeholder: 'https://' })}
      </div>
    </SecaoForm>
  )
}

function SecaoResumo({ valores, aoAlterar }) {
  return (
    <SecaoForm titulo="Resumo profissional">
      <FormField
        as="textarea"
        label="Resumo"
        name="resumo"
        rows={5}
        maxLength={LIMITE_RESUMO}
        spellCheck
        lang="pt-BR"
        hint={`3 a 5 linhas: formação, área, principais competências e diferenciais. Evite "busco oportunidade de crescimento". ${valores.resumo.length}/${LIMITE_RESUMO}`}
        value={valores.resumo}
        onChange={aoAlterar}
      />
    </SecaoForm>
  )
}

function SecaoCompetencias({ valores, aoAlterar }) {
  return (
    <SecaoForm titulo="Competências" descricao="O ATS compara estes termos com a vaga: use o nome padrão do mercado.">
      <FormField
        label="Competências técnicas"
        name="habilidades"
        placeholder="Ex.: Excel avançado, atendimento ao cliente, Power BI, AutoCAD"
        hint="Ferramentas, métodos e conhecimentos da sua área. Separe por vírgula."
        value={valores.habilidades}
        onChange={aoAlterar}
      />
      <FormField
        label="Competências comportamentais"
        name="competencias"
        placeholder="Ex.: comunicação, organização, trabalho em equipe"
        hint="Só as que você consegue mostrar com um exemplo no currículo. Separe por vírgula."
        value={valores.competencias}
        onChange={aoAlterar}
      />
    </SecaoForm>
  )
}

/**
 * Formulário completo do currículo, usado na criação e no editor.
 * @param {object} props
 * @param {ReturnType<typeof import('../../hooks/useFormCurriculo').default>} props.form
 */
export default function FormularioCurriculo({ form }) {
  const { valores, erros, atualizarCampo } = form
  const [experiencias, ...outrasListas] = LISTAS

  const secaoLista = ({ lista, titulo, descricao, adicionar, tituloItem, Campos }) => (
    <SecaoForm key={lista} titulo={titulo} descricao={descricao}>
      <SecaoLista
        itens={valores[lista]}
        lista={lista}
        erros={erros}
        tituloItem={tituloItem}
        textoAdicionar={adicionar}
        aoAdicionar={() => form.adicionarItem(lista)}
        aoRemover={(chave) => form.removerItem(lista, chave)}
      >
        {(item) => <Campos item={item} alterar={criarAlterar(form.atualizarItem, lista, item)} />}
      </SecaoLista>
    </SecaoForm>
  )

  return (
    <div className="formulario-curriculo">
      <SecaoContato valores={valores} erros={erros} aoAlterar={atualizarCampo} />
      <SecaoResumo valores={valores} aoAlterar={atualizarCampo} />
      {secaoLista(experiencias)}
      {outrasListas.slice(0, 2).map(secaoLista)}
      <SecaoCompetencias valores={valores} aoAlterar={atualizarCampo} />
      {outrasListas.slice(2).map(secaoLista)}
      <SecaoForm titulo="Atividades complementares" descricao="Monitoria, voluntariado, hackathons, intercâmbio, eventos. Uma por linha.">
        <FormField
          as="textarea"
          label="Atividades"
          name="atividades"
          rows={3}
          spellCheck
          lang="pt-BR"
          value={valores.atividades}
          onChange={atualizarCampo}
        />
      </SecaoForm>
    </div>
  )
}
