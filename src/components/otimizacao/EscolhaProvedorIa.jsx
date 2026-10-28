import { useEffect } from 'react'
import Chip from '../common/Chip'
import useApi from '../../hooks/useApi'
import { listarProvedores } from '../../services/iaService'
import './EscolhaProvedorIa.css'

/**
 * Escolha do provedor de IA antes de otimizar: Anthropic, OpenAI ou Google.
 * Provedor sem chave no .env da API aparece desabilitado; sem nenhum, o Alvo usa o modo demonstração.
 * @param {object} props
 * @param {string} props.valor - Id do provedor escolhido; '' = modo demonstração.
 * @param {(id: string) => void} props.aoMudar
 */
export default function EscolhaProvedorIa({ valor, aoMudar }) {
  const { data } = useApi(listarProvedores)
  const provedores = data?.provedores ?? []

  // Já começa no primeiro provedor configurado, para não rodar em demonstração sem querer
  useEffect(() => {
    const primeiro = data?.provedores.find((provedor) => provedor.disponivel)
    if (primeiro) aoMudar(primeiro.id)
  }, [data, aoMudar])

  return (
    <fieldset className="escolha-ia">
      <legend className="escolha-ia__titulo">Inteligência artificial</legend>
      <div className="escolha-ia__opcoes">
        {provedores.map((provedor) => (
          <Chip
            key={provedor.id}
            ativo={valor === provedor.id}
            disabled={!provedor.disponivel}
            detalhe={provedor.disponivel ? undefined : 'sem chave'}
            aoClicar={() => aoMudar(provedor.id)}
          >
            {provedor.nome}
          </Chip>
        ))}
        <Chip ativo={valor === ''} aoClicar={() => aoMudar('')}>
          Sem IA (demonstração)
        </Chip>
      </div>
      {data?.modoDemonstracao && (
        <p className="escolha-ia__aviso">
          Nenhuma chave de IA configurada na API: a análise usa regras. Veja o README da API para ativar um provedor.
        </p>
      )}
    </fieldset>
  )
}
