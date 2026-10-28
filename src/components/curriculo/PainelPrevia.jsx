import { useState } from 'react'
import Card from '../common/Card'
import LoadingSpinner from '../common/LoadingSpinner'
import usePreviaAts from '../../hooks/usePreviaAts'
import PreviaAts from './PreviaAts'
import PreviaCurriculo from './PreviaCurriculo'
import './PainelPrevia.css'

const ABAS = [
  { id: 'documento', rotulo: 'Prévia' },
  { id: 'ats', rotulo: 'Leitura ATS' },
]

/**
 * Painel lateral do formulário: prévia do documento final ou leitura ATS, atualizadas ao digitar (US03).
 * @param {object} props
 * @param {object} props.valores - Estado do formulário.
 */
export default function PainelPrevia({ valores }) {
  const [aba, setAba] = useState('documento')
  const { previa, carregando } = usePreviaAts(valores)

  return (
    <aside className="painel-previa" aria-label="Prévia do currículo">
      <div className="painel-previa__topo">
        <div className="painel-previa__abas" role="tablist">
          {ABAS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={aba === item.id}
              className={`painel-previa__aba${aba === item.id ? ' painel-previa__aba--ativa' : ''}`}
              onClick={() => setAba(item.id)}
            >
              {item.rotulo}
            </button>
          ))}
        </div>
        {previa && (
          <p className="painel-previa__nota">
            Nota ATS <strong>{previa.pontuacao.total}</strong>/100
          </p>
        )}
      </div>
      {!previa && carregando && <LoadingSpinner label="Montando a prévia…" />}
      {!previa && !carregando && <p className="painel-previa__erro">Sem conexão com a API: a prévia aparece quando ela estiver no ar.</p>}
      {previa && aba === 'documento' && <PreviaCurriculo documento={previa.documento} />}
      {previa && aba === 'ats' && (
        <Card>
          <PreviaAts leitura={previa} />
        </Card>
      )}
    </aside>
  )
}
