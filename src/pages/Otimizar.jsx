import { useState } from 'react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import FormField from '../components/common/FormField'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ResultadoAnalise from '../components/otimizacao/ResultadoAnalise'
import useApi from '../hooks/useApi'
import { listarCurriculos } from '../services/curriculoService'
import { analisarCompatibilidade } from '../services/otimizacaoService'
import './Otimizar.css'

// Descrições muito curtas não têm palavras-chave suficientes para a comparação fazer sentido
const MINIMO_CARACTERES_VAGA = 80

/** Valida a escolha do currículo e o tamanho da descrição da vaga. */
function validarEntrada(idCurriculo, descricaoVaga) {
  const erros = {}
  if (!idCurriculo) erros.curriculo = 'Escolha qual currículo comparar.'
  if (descricaoVaga.trim().length < MINIMO_CARACTERES_VAGA) {
    erros.vaga = `Cole a descrição completa da vaga (mínimo de ${MINIMO_CARACTERES_VAGA} caracteres).`
  }
  return erros
}

/** Estado do formulário e execução da análise, separados da apresentação. */
function useAnaliseVaga(curriculos) {
  const [idCurriculo, setIdCurriculo] = useState('')
  const [descricaoVaga, setDescricaoVaga] = useState('')
  const [erros, setErros] = useState({})
  const [resultado, setResultado] = useState(null)

  function analisar(evento) {
    evento.preventDefault()
    const errosEncontrados = validarEntrada(idCurriculo, descricaoVaga)
    setErros(errosEncontrados)
    if (Object.keys(errosEncontrados).length > 0) return
    const curriculo = curriculos.find((item) => String(item.id) === idCurriculo)
    setResultado(analisarCompatibilidade(curriculo, descricaoVaga))
  }

  return { idCurriculo, setIdCurriculo, descricaoVaga, setDescricaoVaga, erros, resultado, analisar }
}

/** Formulário: escolha do currículo e descrição da vaga. */
function FormularioAnalise({ curriculos, analise }) {
  return (
    <Card as="form" className="otimizar__form" onSubmit={analise.analisar} noValidate>
      <FormField
        as="select"
        label="Currículo"
        name="curriculo"
        value={analise.idCurriculo}
        onChange={(evento) => analise.setIdCurriculo(evento.target.value)}
        error={analise.erros.curriculo}
        obrigatorio
      >
        <option value="">Selecione um currículo</option>
        {curriculos.map((curriculo) => (
          <option key={curriculo.id} value={curriculo.id}>
            {curriculo.cargoAlvo} ({curriculo.nome})
          </option>
        ))}
      </FormField>
      <FormField
        as="textarea"
        label="Descrição da vaga"
        name="descricaoVaga"
        rows={9}
        placeholder="Cole aqui o texto completo do anúncio: atividades, requisitos e diferenciais."
        value={analise.descricaoVaga}
        onChange={(evento) => analise.setDescricaoVaga(evento.target.value)}
        error={analise.erros.vaga}
        obrigatorio
      />
      <Button type="submit" fullWidth>
        Analisar compatibilidade
      </Button>
    </Card>
  )
}

/** Conteúdo conforme o carregamento da lista de currículos. */
function ConteudoOtimizar({ curriculos, loading, error, recarregar }) {
  const analise = useAnaliseVaga(curriculos ?? [])

  if (loading) return <LoadingSpinner label="Carregando seus currículos…" />
  if (error) {
    return (
      <EmptyState
        tone="error"
        title="Não foi possível carregar seus currículos"
        description={error}
        action={<Button variant="secondary" onClick={recarregar}>Tentar de novo</Button>}
      />
    )
  }

  return (
    <div className="otimizar">
      <FormularioAnalise curriculos={curriculos} analise={analise} />
      {analise.resultado ? (
        <ResultadoAnalise resultado={analise.resultado} />
      ) : (
        <EmptyState title="O resultado aparece aqui" description="Escolha um currículo, cole a vaga e clique em Analisar compatibilidade." />
      )}
    </div>
  )
}

/** Página "Otimizar": compara um currículo com a descrição de uma vaga (US04 e US05). */
export default function Otimizar() {
  const { data, loading, error, recarregar } = useApi(listarCurriculos)

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <h1 className="page__title">Otimizar para uma vaga</h1>
          <p className="page__lead">
            Veja quais palavras-chave da vaga já estão no seu currículo e o que vale incluir.
          </p>
        </div>
      </header>
      <ConteudoOtimizar curriculos={data} loading={loading} error={error} recarregar={recarregar} />
    </section>
  )
}
