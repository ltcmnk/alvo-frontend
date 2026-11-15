import api from './api'

/**
 * @typedef {object} Provedor
 * @property {'anthropic'|'openai'|'google'} id
 * @property {string} nome
 * @property {string} modelo
 * @property {boolean} disponivel - false quando a chave não está no .env da API.
 */

/**
 * Provedores de IA e quais estão configurados (GET /api/ia/provedores).
 * @returns {Promise<{ provedores: Provedor[], modoDemonstracao: boolean }>}
 */
export async function listarProvedores() {
  const resposta = await api.get('/ia/provedores')
  return resposta.data
}

// A IA pode levar mais de um minuto para responder; o padrão do cliente é 8 s
const TEMPO_IA_MS = 180_000

/**
 * Análise automática da descrição da vaga, sem IA e instantânea (POST /api/ia/analisar-vaga).
 * @param {string} descricaoVaga
 * @returns {Promise<{ cargo?: string, senioridade?: string, area?: string,
 *   requisitos: { texto: string, tipo: 'obrigatorio'|'desejavel' }[],
 *   palavrasChave: { termo: string, categoria: string, importancia: 'alta'|'media'|'baixa' }[] }>}
 */
export async function analisarVaga(descricaoVaga) {
  const resposta = await api.post('/ia/analisar-vaga', { descricaoVaga })
  return resposta.data
}

/**
 * Relatório de compatibilidade currículo × vaga, gerado antes de salvar (POST /api/ia/compatibilidade).
 * @param {object} curriculo - Conteúdo do currículo (sem id e metadados).
 * @param {string} descricaoVaga
 * @param {string} [provedor] - Sem provedor, a API usa o modo demonstração.
 */
export async function gerarRelatorio(curriculo, descricaoVaga, provedor) {
  const resposta = await api.post('/ia/compatibilidade', { curriculo, descricaoVaga, provedor }, { timeout: TEMPO_IA_MS })
  return resposta.data
}

/**
 * Currículo otimizado para ATS (e para a vaga, se houver), com nota antes e depois (POST /api/ia/otimizar).
 * Não salva nada: o usuário revisa antes.
 * @param {object} curriculo
 * @param {string} [descricaoVaga]
 * @param {string} [provedor]
 */
export async function otimizarCurriculo(curriculo, descricaoVaga, provedor) {
  const resposta = await api.post('/ia/otimizar', { curriculo, descricaoVaga, provedor }, { timeout: TEMPO_IA_MS })
  return resposta.data
}
