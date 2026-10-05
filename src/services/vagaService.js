import api from './api'

/** Etapas da candidatura na ordem em que acontecem; define a ordem das colunas na tela. */
export const STATUS_VAGA = ['aplicado', 'entrevista', 'oferta', 'rejeitado']

/**
 * @typedef {object} Vaga
 * @property {number} id
 * @property {string} empresa
 * @property {string} cargo
 * @property {'aplicado'|'entrevista'|'oferta'|'rejeitado'} status
 * @property {string} [link]
 * @property {string} aplicadoEm - Data ISO 8601.
 */

/**
 * Lista as candidaturas (GET /api/vagas).
 * @returns {Promise<Vaga[]>}
 */
export async function listarVagas() {
  const resposta = await api.get('/vagas')
  return resposta.data
}

/**
 * Registra uma candidatura (POST /api/vagas). `empresa` e `cargo` são obrigatórios.
 * @param {object} dados
 * @returns {Promise<Vaga>} A vaga criada.
 */
export async function criarVaga(dados) {
  const resposta = await api.post('/vagas', dados)
  return resposta.data
}