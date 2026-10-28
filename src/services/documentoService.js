import api from './api'

/**
 * @typedef {object} LeituraAts
 * @property {string} texto - O currículo em texto puro, na ordem em que o ATS lê.
 * @property {{ secoes: string[], motivo: string }} ordem - Ordem das seções escolhida para o perfil.
 * @property {{ campo: string, valor?: string, status: 'ok'|'atencao'|'ausente' }[]} campos - O que o ATS extrai.
 * @property {string[]} alertas - O que pode atrapalhar a leitura.
 * @property {object} documento - Cabeçalho e seções, igual ao PDF exportado.
 * @property {{ total: number, criterios: { id: string, nome: string, nota: number, peso: number, dicas: string[] }[] }} pontuacao
 */

/**
 * Prévia do documento final e de como o ATS lê o currículo (POST /api/curriculos/previa-ats).
 * Não salva nada.
 * @param {object} curriculo - Corpo no formato da API (ver paraApi).
 * @returns {Promise<LeituraAts>}
 */
export async function gerarPreviaAts(curriculo) {
  const resposta = await api.post('/curriculos/previa-ats', curriculo)
  return resposta.data
}
