import axios from 'axios'

// O Vite expõe variáveis por import.meta.env, e só as que começam com VITE_.
// O exemplo do requisito usa process.env.REACT_APP_API_URL, que é sintaxe do Create React App.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const MENSAGEM_SEM_CONEXAO = 'Não conseguimos falar com a API. Ela está rodando na porta 3001?'

/** Cliente HTTP único do app: todas as chamadas à API passam por aqui. */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // evita a tela presa em "carregando" se a API travar
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Converte um erro do axios em uma mensagem curta, em português, para mostrar na tela.
 * @param {unknown} erro - Erro lançado pelo axios.
 * @returns {string} Mensagem pronta para o usuário.
 */
export function extrairMensagemErro(erro) {
  if (!erro?.response) return MENSAGEM_SEM_CONEXAO

  const { error, detalhes } = erro.response.data ?? {}
  if (Array.isArray(detalhes) && detalhes.length > 0) return detalhes.join(' · ')
  return error || `A API respondeu com erro ${erro.response.status}.`
}

export default api