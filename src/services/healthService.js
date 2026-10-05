import api from './api'

/**
 * Consulta GET /api/health.
 * @returns {Promise<{status: string, service: string, ambiente: string, timestamp: string}>}
 */
export async function verificarSaudeApi() {
  const resposta = await api.get('/health')
  return resposta.data
}