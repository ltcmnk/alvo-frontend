import api from './api'

/**
 * @typedef {object} Curriculo
 * @property {number} id
 * @property {string} nome
 * @property {string} cargoAlvo
 * @property {'base'|'otimizado'|'sob-medida'} tipo
 * @property {number} pontuacao - De 0 a 100.
 * @property {string[]} habilidades
 * @property {string} atualizadoEm - Data ISO 8601.
 */

/**
 * Lista os currículos (GET /api/curriculos).
 * @returns {Promise<Curriculo[]>}
 */
export async function listarCurriculos() {
  const resposta = await api.get('/curriculos')
  return resposta.data
}

/**
 * Busca um currículo pelo id (GET /api/curriculos/:id).
 * @param {number|string} id
 * @returns {Promise<Curriculo>}
 */
export async function buscarCurriculo(id) {
  const resposta = await api.get(`/curriculos/${id}`)
  return resposta.data
}

/**
 * Cria um currículo (POST /api/curriculos). `nome` e `cargoAlvo` são obrigatórios.
 * @param {object} dados - Campos do formulário.
 * @returns {Promise<Curriculo>} O currículo criado.
 */
export async function criarCurriculo(dados) {
  const resposta = await api.post('/curriculos', dados)
  return resposta.data
}