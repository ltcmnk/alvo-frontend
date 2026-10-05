import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusTag from '../components/common/StatusTag'
import useApi from '../hooks/useApi'
import { listarVagas, STATUS_VAGA } from '../services/vagaService'
import { formatarData } from '../utils/formatarData'
import './Vagas.css'

/**
 * Separa as vagas em colunas, uma por etapa, na ordem de STATUS_VAGA.
 * @param {import('../services/vagaService').Vaga[]} vagas
 * @returns {{ status: string, vagas: object[] }[]}
 */
function agruparPorStatus(vagas) {
  return STATUS_VAGA.map((status) => ({
    status,
    vagas: vagas.filter((vaga) => vaga.status === status),
  }))
}

/** Uma coluna do quadro: etiqueta da etapa, total e as vagas dela. */
function ColunaStatus({ status, vagas }) {
  return (
    <section className="coluna-vagas" aria-label={`Etapa ${status}`}>
      <header className="coluna-vagas__topo">
        <StatusTag status={status} />
        <span className="coluna-vagas__total">{vagas.length}</span>
      </header>
      {vagas.length === 0 ? (
        <p className="coluna-vagas__vazia">Nenhuma vaga nesta etapa.</p>
      ) : (
        <ul className="coluna-vagas__lista">
          {vagas.map((vaga) => (
            <Card as="li" compact key={vaga.id} className="cartao-vaga">
              <p className="cartao-vaga__empresa">{vaga.empresa}</p>
              <p className="cartao-vaga__cargo">{vaga.cargo}</p>
              <p className="cartao-vaga__data">Desde {formatarData(vaga.aplicadoEm)}</p>
            </Card>
          ))}
        </ul>
      )}
    </section>
  )
}

/** Decide o que mostrar: carregando, erro, nenhuma vaga ou o quadro por etapa. */
function ConteudoVagas({ vagas, loading, error, recarregar }) {
  if (loading) return <LoadingSpinner label="Carregando candidaturas…" />

  if (error) {
    return (
      <EmptyState
        tone="error"
        title="Não foi possível carregar as candidaturas"
        description={error}
        action={
          <Button variant="secondary" onClick={recarregar}>
            Tentar de novo
          </Button>
        }
      />
    )
  }

  if (vagas.length === 0) {
    return (
      <EmptyState
        title="Nenhuma candidatura registrada"
        description="As vagas em que você se candidatar aparecem aqui, separadas por etapa."
      />
    )
  }

  return (
    <div className="quadro-vagas">
      {agruparPorStatus(vagas).map((coluna) => (
        <ColunaStatus key={coluna.status} status={coluna.status} vagas={coluna.vagas} />
      ))}
    </div>
  )
}

/** Página "Candidaturas": vagas de GET /api/vagas agrupadas por etapa. */
export default function Vagas() {
  const { data, loading, error, recarregar } = useApi(listarVagas)

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <h1 className="page__title">Candidaturas</h1>
          <p className="page__lead">Acompanhe em que etapa está cada vaga.</p>
        </div>
      </header>
      <ConteudoVagas vagas={data} loading={loading} error={error} recarregar={recarregar} />
    </section>
  )
}