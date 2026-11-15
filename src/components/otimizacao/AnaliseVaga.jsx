import Etiqueta from '../common/Etiqueta'
import './AnaliseVaga.css'

const TOM_IMPORTANCIA = { alta: 'azul', media: 'neutro', baixa: 'lavanda' }

/** Card lilás do protótipo explicando o fluxo, enquanto a vaga não foi colada. */
function ComoFunciona() {
  return (
    <div className="analise-vaga analise-vaga--vazia">
      <p className="analise-vaga__titulo">Como a otimização funciona</p>
      <ol>
        <li>Escolha o currículo e cole a descrição completa da vaga.</li>
        <li>Veja as palavras-chave da vaga e o relatório de compatibilidade.</li>
        <li>A IA reescreve para o ATS sem inventar nada. Você revisa e salva.</li>
      </ol>
      <p className="analise-vaga__dica">
        <strong>Sem vaga?</strong> Dá para otimizar só para ATS, sem relatório.
      </p>
    </div>
  )
}

/**
 * Análise automática da vaga: palavras-chave do setor para incluir no currículo antes de enviar.
 * @param {object} props
 * @param {object|null} props.analise - Resposta de POST /api/ia/analisar-vaga.
 */
export default function AnaliseVaga({ analise }) {
  if (!analise) return <ComoFunciona />
  const resumo = [analise.senioridade, analise.area].filter(Boolean).join(' · ')
  const contar = (tipo) => analise.requisitos.filter((requisito) => requisito.tipo === tipo).length
  return (
    <div className="analise-vaga" aria-live="polite">
      <p className="analise-vaga__rotulo">Análise automática da vaga</p>
      {analise.cargo && <p className="analise-vaga__cargo">{analise.cargo}</p>}
      {resumo && <p className="analise-vaga__resumo">{resumo}</p>}
      <p className="analise-vaga__subtitulo">Palavras-chave para ter no currículo (se forem verdade para você)</p>
      {analise.palavrasChave.length === 0 ? (
        <p className="analise-vaga__resumo">Nenhum termo reconhecido ainda. Cole o anúncio completo, com requisitos.</p>
      ) : (
        <ul className="analise-vaga__palavras">
          {analise.palavrasChave.map((palavra) => (
            <li key={palavra.termo} title={`${palavra.categoria} · importância ${palavra.importancia}`}>
              <Etiqueta tom={TOM_IMPORTANCIA[palavra.importancia]}>{palavra.termo}</Etiqueta>
            </li>
          ))}
        </ul>
      )}
      <p className="analise-vaga__legenda">
        <Etiqueta tom="azul">alta</Etiqueta> requisito ou citada várias vezes · <Etiqueta tom="lavanda">baixa</Etiqueta> diferencial
      </p>
      {analise.requisitos.length > 0 && (
        <p className="analise-vaga__resumo">
          {contar('obrigatorio')} requisito(s) e {contar('desejavel')} diferencial(is) encontrados no anúncio.
        </p>
      )}
    </div>
  )
}
