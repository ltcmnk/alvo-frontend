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

// Ler e organizar o arquivo com IA pode passar de um minuto; o padrão do cliente é 8 s
const TEMPO_LEITURA_MS = 120_000

/**
 * Lê um currículo existente em PDF ou DOCX (POST /api/documentos/ler). O arquivo não é salvo:
 * a API extrai o texto, organiza nos campos e descarta o arquivo.
 * @param {File} arquivo
 * @param {string} [provedor] - Provedor de IA para organizar o texto; sem ele, usa regras.
 * @returns {Promise<{ nomeArquivo: string, texto: string, curriculo: object, modo: 'ia'|'regras', avisos: string[] }>}
 */
export async function lerArquivo(arquivo, provedor) {
  const dados = new FormData()
  dados.append('arquivo', arquivo)
  if (provedor) dados.append('provedor', provedor)
  // Sem Content-Type manual: o navegador define o multipart com o boundary certo
  const resposta = await api.post('/documentos/ler', dados, { timeout: TEMPO_LEITURA_MS, headers: { 'Content-Type': undefined } })
  return resposta.data
}
