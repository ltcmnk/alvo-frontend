import { useCallback, useEffect, useState } from 'react'
import { extrairMensagemErro } from '../services/api'

/**
 * Executa uma chamada à API ao montar o componente e controla carregamento e erro,
 * para que cada página não repita o mesmo try/catch.
 *
 * Passe uma função de service declarada fora do componente (ex.: `listarCurriculos`).
 * Uma função criada dentro do componente muda a cada render e repetiria a chamada sem parar.
 *
 * @param {() => Promise<any>} requisicao - Função que retorna os dados.
 * @returns {{ data: any, loading: boolean, error: string|null, recarregar: () => void }}
 */
export default function useApi(requisicao) {
  const [estado, setEstado] = useState({ data: null, loading: true, error: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    // Ignora respostas que chegam depois que o usuário já saiu da página
    let ativo = true

    requisicao()
      .then((data) => ativo && setEstado({ data, loading: false, error: null }))
      .catch((erro) => {
        if (!ativo) return
        console.error('Falha na requisição à API:', erro)
        setEstado({ data: null, loading: false, error: extrairMensagemErro(erro) })
      })

    return () => {
      ativo = false
    }
  }, [requisicao, tentativa])

  const recarregar = useCallback(() => {
    setEstado((anterior) => ({ ...anterior, loading: true, error: null }))
    setTentativa((valor) => valor + 1)
  }, [])

  return { ...estado, recarregar }
}