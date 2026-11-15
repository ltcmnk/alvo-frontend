import FormField from '../common/FormField'
import { CONTEXTOS_PROJETO, NIVEIS_IDIOMA, SITUACOES_FORMACAO } from '../../utils/curriculo'

/** Opções de um <select> a partir das listas de utils/curriculo. */
const opcoes = (lista) =>
  lista.map((opcao) => (
    <option key={opcao.valor} value={opcao.valor}>
      {opcao.rotulo}
    </option>
  ))

/**
 * Campo de mês e ano. Se o currículo lido de um arquivo só tem o ano ("2021"), vira campo de texto:
 * o <input type="month"> apagaria esse valor, e completar o mês sozinho seria inventar.
 */
function CampoMes({ label, value, onChange, ...rest }) {
  const soAno = /^\d{4}$/.test(value)
  return (
    <FormField
      label={label}
      type={soAno ? 'text' : 'month'}
      inputMode={soAno ? 'numeric' : undefined}
      placeholder="AAAA-MM"
      hint={soAno ? 'Só o ano. Complete o mês se souber.' : undefined}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )
}

export function CamposExperiencia({ item, alterar }) {
  return (
    <>
      <div className="campos-duplos">
        <FormField label="Cargo" name="cargo" value={item.cargo} onChange={alterar('cargo')} obrigatorio />
        <FormField label="Empresa" name="empresa" value={item.empresa} onChange={alterar('empresa')} obrigatorio />
        <CampoMes label="Início" value={item.inicio} onChange={alterar('inicio')} />
        <CampoMes label="Fim" value={item.atual ? '' : item.fim} onChange={alterar('fim')} disabled={item.atual} />
      </div>
      <label className="campo-checkbox">
        <input type="checkbox" checked={item.atual} onChange={alterar('atual')} />
        Trabalho aqui atualmente
      </label>
      <FormField label="Cidade" name="local" placeholder="Ex.: Curitiba, PR" value={item.local} onChange={alterar('local')} />
      <FormField
        as="textarea"
        label="O que você fez e qual foi o resultado"
        name="descricao"
        rows={4}
        spellCheck
        lang="pt-BR"
        hint="Uma realização por linha, começando com verbo (atendi, organizei, desenvolvi). Números só se forem reais."
        value={item.descricao}
        onChange={alterar('descricao')}
      />
    </>
  )
}

export function CamposFormacao({ item, alterar }) {
  return (
    <div className="campos-duplos">
      <FormField label="Curso" name="curso" placeholder="Ex.: Bacharelado em Administração" value={item.curso} onChange={alterar('curso')} obrigatorio />
      <FormField label="Instituição" name="instituicao" value={item.instituicao} onChange={alterar('instituicao')} obrigatorio />
      <FormField as="select" label="Situação" name="situacao" value={item.situacao} onChange={alterar('situacao')}>
        {opcoes(SITUACOES_FORMACAO)}
      </FormField>
      <CampoMes label="Início" value={item.inicio} onChange={alterar('inicio')} />
      <CampoMes label={item.situacao === 'cursando' ? 'Previsão de conclusão' : 'Conclusão'} value={item.fim} onChange={alterar('fim')} />
    </div>
  )
}

export function CamposProjeto({ item, alterar }) {
  return (
    <>
      <div className="campos-duplos">
        <FormField label="Nome do projeto" name="nome" value={item.nome} onChange={alterar('nome')} obrigatorio />
        <FormField as="select" label="Contexto" name="contexto" value={item.contexto} onChange={alterar('contexto')}>
          {opcoes(CONTEXTOS_PROJETO)}
        </FormField>
        <FormField
          label="Ferramentas e tecnologias"
          name="tecnologias"
          placeholder="Ex.: Excel, Power BI"
          hint="Separe por vírgula."
          value={item.tecnologias}
          onChange={alterar('tecnologias')}
        />
        <FormField label="Link" name="link" type="url" placeholder="https://" value={item.link} onChange={alterar('link')} />
      </div>
      <FormField
        as="textarea"
        label="O que você fez no projeto"
        name="descricao"
        rows={3}
        spellCheck
        lang="pt-BR"
        hint="Objetivo, sua parte e o resultado. Uma frase por linha."
        value={item.descricao}
        onChange={alterar('descricao')}
      />
    </>
  )
}

export function CamposIdioma({ item, alterar }) {
  return (
    <div className="campos-duplos">
      <FormField label="Idioma" name="idioma" placeholder="Ex.: Inglês" value={item.idioma} onChange={alterar('idioma')} obrigatorio />
      <FormField as="select" label="Nível" name="nivel" value={item.nivel} onChange={alterar('nivel')}>
        {opcoes(NIVEIS_IDIOMA)}
      </FormField>
    </div>
  )
}

export function CamposCertificacao({ item, alterar }) {
  return (
    <div className="campos-duplos">
      <FormField label="Certificação ou curso" name="nome" value={item.nome} onChange={alterar('nome')} obrigatorio />
      <FormField label="Instituição" name="instituicao" value={item.instituicao} onChange={alterar('instituicao')} />
      <FormField label="Ano" name="ano" inputMode="numeric" maxLength={4} placeholder="AAAA" value={item.ano} onChange={alterar('ano')} />
    </div>
  )
}
