import useApi from '../hooks/useApi'
import { verificarSaudeApi } from '../services/healthService'
import './ApiStatus.css'

/**
 * Teste de integração: mostra se o frontend consegue falar com a API (GET /api/health).
 * Com a API desligada, exibe o erro e permite tentar de novo sem recarregar a página.
 */
export default function ApiStatus() {
  const { data, loading, error, recarregar } = useApi(verificarSaudeApi)

  if (loading) {
    return (
      <p className="api-status api-status--verificando" role="status">
        <span className="api-status__ponto" aria-hidden="true" />
        <span className="api-status__texto">Verificando a conexão com a API…</span>
      </p>
    )
  }

  if (error) {
    return (
      <div className="api-status api-status--erro" role="alert">
        <span className="api-status__ponto" aria-hidden="true" />
        <span className="api-status__texto">
          {error}{' '}
          <button type="button" className="api-status__tentar" onClick={recarregar}>
            Tentar de novo
          </button>
        </span>
      </div>
    )
  }

  return (
    <p className="api-status api-status--online" role="status">
      <span className="api-status__ponto" aria-hidden="true" />
      <span className="api-status__texto">
        API conectada ({data.service}, ambiente {data.ambiente})
      </span>
    </p>
  )
}