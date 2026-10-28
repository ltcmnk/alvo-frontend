import { useEffect, useState } from 'react'
import { gerarPreviaAts } from '../services/documentoService'
import { paraApi } from '../utils/curriculo'

// Espera o usuário parar de digitar antes de pedir a prévia, para não chamar a API a cada tecla
const ESPERA_MS = 600

/**
 * Prévia ao vivo do currículo: documento final, leitura ATS e nota, atualizados enquanto se digita.
 * Se um pedido falhar (ex.: e-mail digitado pela metade), mantém a última prévia válida.
 * @param {object} valores - Estado do formulário.
 * @returns {{ previa: import('../services/documentoService').LeituraAts | null, carregando: boolean }}
 */
export default function usePreviaAts(valores) {
  const [previa, setPrevia] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true
    // Nome e cargo são obrigatórios na API; enquanto vazios, a prévia mostra textos de exemplo
    const corpo = { ...paraApi(valores), nome: valores.nome.trim() || 'Seu nome', cargoAlvo: valores.cargoAlvo.trim() || 'Cargo' }
    const espera = setTimeout(() => {
      setCarregando(true)
      gerarPreviaAts(corpo)
        .then((dados) => ativo && setPrevia(dados))
        .catch(() => {}) // erro de validação no meio da digitação: fica a prévia anterior
        .finally(() => ativo && setCarregando(false))
    }, ESPERA_MS)
    return () => {
      ativo = false
      clearTimeout(espera)
    }
  }, [valores])

  return { previa, carregando }
}
