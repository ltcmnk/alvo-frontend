import api from './api'

// Gerar PDF/DOCX é rápido, mas a primeira chamada pode demorar mais que os 8 s padrão
const TEMPO_EXPORTACAO_MS = 30_000

/** Erros de download vêm como Blob: converte de volta para JSON para extrairMensagemErro ler. */
async function lerErroBlob(erro) {
  const dados = erro.response?.data
  if (dados instanceof Blob) {
    try {
      erro.response.data = JSON.parse(await dados.text())
    } catch {
      // Corpo não é JSON: fica a mensagem genérica
    }
  }
  return erro
}

/** Nome do arquivo que a API mandou no cabeçalho Content-Disposition. */
function nomeDoArquivo(cabecalho, formato) {
  return cabecalho?.match(/filename="([^"]+)"/)?.[1] ?? `curriculo.${formato}`
}

/**
 * Baixa o currículo em PDF, DOCX ou LaTeX (POST /api/documentos/exportar).
 * Recebe o conteúdo, e não o id: assim dá para exportar o que está no editor antes de salvar.
 * @param {object} curriculo - Corpo no formato da API (ver paraApi).
 * @param {'pdf'|'docx'|'tex'} formato
 */
export async function exportarCurriculo(curriculo, formato) {
  try {
    const resposta = await api.post('/documentos/exportar', { formato, curriculo }, { responseType: 'blob', timeout: TEMPO_EXPORTACAO_MS })
    const url = URL.createObjectURL(resposta.data)
    const link = document.createElement('a')
    link.href = url
    link.download = nomeDoArquivo(resposta.headers['content-disposition'], formato)
    link.click()
    URL.revokeObjectURL(url)
  } catch (erro) {
    throw await lerErroBlob(erro)
  }
}

/**
 * Revisão ortográfica e gramatical dos campos editados (POST /api/documentos/ortografia).
 * @param {{ id: string, texto: string }[]} campos
 * @returns {Promise<{ correcoes: { campoId: string, inicio: number, tamanho: number, trecho: string, mensagem: string, sugestoes: string[] }[] }>}
 */
export async function revisarOrtografia(campos) {
  const resposta = await api.post('/documentos/ortografia', { campos }, { timeout: TEMPO_EXPORTACAO_MS })
  return resposta.data
}
