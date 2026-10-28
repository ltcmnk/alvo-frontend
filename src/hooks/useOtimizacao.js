import { useCallback, useEffect, useState } from 'react'
import { extrairMensagemErro } from '../services/api'
import { analisarVaga, gerarRelatorio, otimizarCurriculo } from '../services/iaService'
import { conteudoDoCurriculo } from '../utils/curriculo'

// Abaixo disso o anúncio não tem requisitos suficientes para uma comparação útil (mesmo limite da API)
export const MINIMO_VAGA = 80
const ESPERA_ANALISE_MS = 500

/** Análise automática da vaga enquanto o usuário cola o texto (sem IA, instantânea). */
function useAnaliseVaga(descricaoVaga) {
  const [analise, setAnalise] = useState(null)
  const longaOSuficiente = descricaoVaga.trim().length >= MINIMO_VAGA
  useEffect(() => {
    if (!longaOSuficiente) return undefined
    let ativo = true
    const espera = setTimeout(() => {
      analisarVaga(descricaoVaga)
        .then((dados) => ativo && setAnalise(dados))
        .catch(() => ativo && setAnalise(null))
    }, ESPERA_ANALISE_MS)
    return () => {
      ativo = false
      clearTimeout(espera)
    }
  }, [descricaoVaga, longaOSuficiente])
  // Texto curto demais: esconde a análise anterior sem precisar de outro render
  return longaOSuficiente ? analise : null
}

/**
 * Estado do fluxo de otimização: entrada → relatório de compatibilidade → resultado.
 * @param {object[]} curriculos - Currículos salvos (GET /api/curriculos).
 * @param {string} [idInicial] - Currículo já escolhido (ex.: vindo de /otimizar?curriculo=3).
 */
export default function useOtimizacao(curriculos, idInicial = '') {
  const [entrada, setEntrada] = useState({ curriculoId: idInicial, descricaoVaga: '', provedor: '' })
  const [etapa, setEtapa] = useState('entrada')
  const [relatorio, setRelatorio] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [processando, setProcessando] = useState(null)
  const [erro, setErro] = useState('')
  const analiseVaga = useAnaliseVaga(entrada.descricaoVaga)
  const curriculo = curriculos.find((item) => String(item.id) === String(entrada.curriculoId))
  const temVaga = entrada.descricaoVaga.trim().length >= MINIMO_VAGA

  // useCallback: a escolha do provedor chama `alterar` dentro de um efeito
  const alterar = useCallback((campo, valor) => setEntrada((atual) => ({ ...atual, [campo]: valor })), [])

  /** Roda uma chamada de IA controlando o "processando" e o erro. */
  async function executar(tipo, chamada, proximaEtapa) {
    if (!curriculo) {
      setErro('Escolha qual currículo usar.')
      return
    }
    setErro('')
    setProcessando(tipo)
    try {
      await chamada(conteudoDoCurriculo(curriculo), entrada.provedor || undefined)
      setEtapa(proximaEtapa)
    } catch (falha) {
      setErro(extrairMensagemErro(falha))
    } finally {
      setProcessando(null)
    }
  }

  const relatar = () => {
    if (!temVaga) {
      setErro(`Cole a descrição completa da vaga (mínimo de ${MINIMO_VAGA} caracteres) para gerar o relatório.`)
      return
    }
    executar('relatorio', async (conteudo, provedor) => setRelatorio(await gerarRelatorio(conteudo, entrada.descricaoVaga, provedor)), 'relatorio')
  }

  const otimizar = () =>
    executar(
      'otimizacao',
      async (conteudo, provedor) => setResultado(await otimizarCurriculo(conteudo, temVaga ? entrada.descricaoVaga : undefined, provedor)),
      'resultado',
    )

  return { entrada, alterar, etapa, setEtapa, relatorio, resultado, processando, erro, analiseVaga, curriculo, temVaga, relatar, otimizar }
}
