/**
 * Formata uma data para o padrão brasileiro.
 * @param {string|Date} data - Data ISO 8601 (como a API envia) ou objeto Date.
 * @param {Intl.DateTimeFormatOptions} [opcoes] - Troque para exibir mês por extenso, hora etc.
 * @returns {string} Data no formato DD/MM/AAAA, ou string vazia se a data for inválida.
 */
export function formatarData(data, opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  const convertida = data instanceof Date ? data : new Date(data)
  if (Number.isNaN(convertida.getTime())) return ''
  return convertida.toLocaleDateString('pt-BR', opcoes)
}