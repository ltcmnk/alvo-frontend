import api from './api'

/**
 * @typedef {object} Curriculo
 * @property {number} id
 * @property {string} nome
 * @property {string} cargoAlvo
 * @property {'base'|'otimizado'|'sob-medida'} tipo
 * @property {number} pontuacao - Nota ATS de 0 a 100, calculada pela API.
 * @property {object[]} experiencias
 * @property {object[]} formacoes
 * @property {object[]} projetos
 * @property {string[]} habilidades
 * @property {string[]} competencias
 * @property {object[]} idiomas
 * @property {object[]} certificacoes
 * @property {string[]} atividades
 * @property {{ empresa?: string, cargo?: string, compatibilidade?: number }} [vagaAlvo]
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
/**
 * Substitui o conteúdo de um currículo (PUT /api/curriculos/:id). A API recalcula a nota ATS.
 * @param {number|string} id
 * @param {object} dados - Corpo no mesmo formato do POST.
 * @returns {Promise<Curriculo>} O currículo atualizado.
 */
export async function atualizarCurriculo(id, dados) {
  const resposta = await api.put(`/curriculos/${id}`, dados)
  return resposta.data
}

/**
 * Exclui um currículo (DELETE /api/curriculos/:id).
 * @param {number|string} id
 */
export async function excluirCurriculo(id) {
  await api.delete(`/curriculos/${id}`)
}
