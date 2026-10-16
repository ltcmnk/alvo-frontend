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
 * @property {number} [curriculoId] - Currículo enviado nesta candidatura.
 * @property {number} [compatibilidade] - % de compatibilidade do currículo com a vaga.
 * @property {string} [notas]
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
/**
 * Altera uma candidatura (PATCH /api/vagas/:id). Envie só o que mudou, como `{ status: 'entrevista' }`.
 * @param {number} id
 * @param {object} dados
 * @returns {Promise<Vaga>} A vaga atualizada.
 */
export async function atualizarVaga(id, dados) {
  const resposta = await api.patch(`/vagas/${id}`, dados)
  return resposta.data
}

/**
 * Exclui uma candidatura (DELETE /api/vagas/:id).
 * @param {number} id
 */
export async function excluirVaga(id) {
  await api.delete(`/vagas/${id}`)
}
