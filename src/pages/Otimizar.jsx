import { useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Chip from '../components/common/Chip'
import EmptyState from '../components/common/EmptyState'
import FormField from '../components/common/FormField'
import LoadingSpinner from '../components/common/LoadingSpinner'
import AnaliseVaga from '../components/otimizacao/AnaliseVaga'
import EscolhaProvedorIa from '../components/otimizacao/EscolhaProvedorIa'
import RelatorioCompatibilidade from '../components/otimizacao/RelatorioCompatibilidade'
import ResultadoOtimizacao from '../components/otimizacao/ResultadoOtimizacao'
import useApi from '../hooks/useApi'
import useOtimizacao, { MINIMO_VAGA } from '../hooks/useOtimizacao'
import { listarCurriculos } from '../services/curriculoService'
import './Otimizar.css'

const ETAPAS = [
  { id: 'entrada', rotulo: 'Currículo e vaga' },
  { id: 'relatorio', rotulo: 'Compatibilidade' },
  { id: 'resultado', rotulo: 'Versão otimizada' },
]

const TEXTO_PROCESSANDO = { relatorio: 'Comparando com a vaga…', otimizacao: 'Reescrevendo e pontuando…' }

/** Indicador das três etapas do fluxo. */
function Etapas({ atual }) {
  const indiceAtual = ETAPAS.findIndex((etapa) => etapa.id === atual)
  return (
    <ol className="etapas" aria-label="Etapas da otimização">
      {ETAPAS.map((etapa, indice) => (
        <li key={etapa.id} className={`etapas__item${indice <= indiceAtual ? ' etapas__item--feita' : ''}`} aria-current={indice === indiceAtual ? 'step' : undefined}>
          <span className="etapas__numero">{indice + 1}</span>
          {etapa.rotulo}
        </li>
      ))}
    </ol>
  )
}

/** Etapa 1: currículo base, vaga, provedor de IA e as duas ações. */
function Entrada({ curriculos, fluxo }) {
  const { entrada, alterar } = fluxo
  return (
    <div className="otimizar__entrada">
      <Card className="otimizar__form">
        <fieldset className="otimizar__curriculos">
          <legend className="titulo-bloco">Currículo base</legend>
          <div className="otimizar__chips">
            {curriculos.map((curriculo) => (
              <Chip key={curriculo.id} ativo={String(curriculo.id) === String(entrada.curriculoId)} aoClicar={() => alterar('curriculoId', String(curriculo.id))} detalhe={`${curriculo.pontuacao}/100`}>
                {curriculo.cargoAlvo}
              </Chip>
            ))}
          </div>
          <Button to="/curriculos/novo" variant="ghost" size="sm">
            + Criar um currículo novo
          </Button>
        </fieldset>
        <FormField
          as="textarea"
          label="Descrição da vaga"
          name="descricaoVaga"
          rows={9}
          placeholder="Cole aqui o anúncio completo: título, atividades, requisitos e diferenciais."
          hint={`${entrada.descricaoVaga.trim().length} caracteres (mínimo ${MINIMO_VAGA} para o relatório).`}
          value={entrada.descricaoVaga}
          onChange={(evento) => alterar('descricaoVaga', evento.target.value)}
        />
        <EscolhaProvedorIa valor={entrada.provedor} aoMudar={(id) => alterar('provedor', id)} />
        {fluxo.erro && (
          <p className="mensagem-envio mensagem-envio--erro" role="alert">
            {fluxo.erro}
          </p>
        )}
        <div className="otimizar__acoes">
          <Button variant="escuro" onClick={fluxo.relatar} disabled={!fluxo.temVaga}>
            Gerar relatório de compatibilidade
          </Button>
          <Button variant="secondary" onClick={fluxo.otimizar}>
            {fluxo.temVaga ? 'Pular e otimizar direto' : 'Otimizar só para ATS'}
          </Button>
        </div>
      </Card>
      <AnaliseVaga analise={fluxo.analiseVaga} />
    </div>
  )
}

/** Conteúdo da página conforme a etapa e o carregamento dos currículos. */
function ConteudoOtimizar({ curriculos, idInicial }) {
  const fluxo = useOtimizacao(curriculos, idInicial)

  if (fluxo.processando) {
    return (
      <Card className="otimizar__processando">
        <LoadingSpinner label={TEXTO_PROCESSANDO[fluxo.processando]} />
        <p>Com IA isso pode levar até um minuto.</p>
      </Card>
    )
  }

  return (
    <>
      <Etapas atual={fluxo.etapa} />
      {fluxo.etapa === 'entrada' && <Entrada curriculos={curriculos} fluxo={fluxo} />}
      {fluxo.etapa === 'relatorio' && (
        <div className="otimizar__etapa">
          <RelatorioCompatibilidade relatorio={fluxo.relatorio} />
          {fluxo.erro && (
            <p className="mensagem-envio mensagem-envio--erro" role="alert">
              {fluxo.erro}
            </p>
          )}
          <div className="otimizar__acoes">
            <Button variant="escuro" onClick={fluxo.otimizar}>
              Otimizar currículo para esta vaga
            </Button>
            <Button variant="secondary" onClick={() => fluxo.setEtapa('entrada')}>
              Voltar e ajustar
            </Button>
          </div>
        </div>
      )}
      {fluxo.etapa === 'resultado' && (
        <ResultadoOtimizacao
          resultado={fluxo.resultado}
          original={fluxo.curriculo}
          analiseVaga={fluxo.temVaga ? fluxo.analiseVaga : null}
          descricaoVaga={fluxo.temVaga ? fluxo.entrada.descricaoVaga : undefined}
          aoRecomecar={() => fluxo.setEtapa('entrada')}
        />
      )}
    </>
  )
}

/** Página "Otimizar": relatório de compatibilidade e otimização do currículo com IA (US04, US05). */
export default function Otimizar() {
  const { data, loading, error, recarregar } = useApi(listarCurriculos)
  const [parametros] = useSearchParams()

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <p className="page__rotulo">Otimizador com IA</p>
          <h1 className="page__title">Otimizar para uma vaga</h1>
          <p className="page__lead">
            Veja o que a vaga pede, o que você já tem e receba uma versão otimizada para ATS, com nota de 0 a 100. A IA
            nunca inventa informação.
          </p>
        </div>
      </header>
      {loading && <LoadingSpinner label="Carregando seus currículos…" />}
      {error && (
        <EmptyState
          tone="error"
          title="Não foi possível carregar seus currículos"
          description={error}
          action={<Button variant="secondary" onClick={recarregar}>Tentar de novo</Button>}
        />
      )}
      {data?.length === 0 && (
        <EmptyState
          title="Você ainda não tem currículos"
          description="Crie ou importe um currículo para comparar com a vaga."
          action={<Button to="/curriculos/novo">Criar currículo</Button>}
        />
      )}
      {data?.length > 0 && <ConteudoOtimizar curriculos={data} idInicial={parametros.get('curriculo') ?? ''} />}
    </section>
  )
}
