import Acordeao from '../common/Acordeao'
import Card from '../common/Card'
import Etiqueta from '../common/Etiqueta'
import ScoreRing from '../common/ScoreRing'
import './RelatorioCompatibilidade.css'

const STATUS = {
  atende: { rotulo: 'Atende', tom: 'salvia', ordem: 2 },
  parcial: { rotulo: 'Em parte', tom: 'manteiga', ordem: 1 },
  nao_atende: { rotulo: 'Em falta', tom: 'erro', ordem: 0 },
}

/** Um requisito da vaga: se o currículo atende, a evidência e como fechar o gap. */
function Requisito({ requisito }) {
  const status = STATUS[requisito.status]
  return (
    <li className={`requisito requisito--${requisito.status}`}>
      <div className="requisito__topo">
        <Etiqueta tom={status.tom}>{status.rotulo}</Etiqueta>
        {requisito.tipo === 'desejavel' && <Etiqueta tom="lavanda">Diferencial</Etiqueta>}
      </div>
      <p className="requisito__texto">{requisito.requisito}</p>
      {requisito.evidencia && <p className="requisito__detalhe">No seu currículo: {requisito.evidencia}</p>}
      {requisito.comoPreencher && (
        <p className="requisito__detalhe requisito__detalhe--gap">
          <strong>Como preencher:</strong> {requisito.comoPreencher}
        </p>
      )}
    </li>
  )
}

function PalavrasChave({ palavras }) {
  const presentes = palavras.filter((palavra) => palavra.presente)
  const ausentes = palavras.filter((palavra) => !palavra.presente)
  return (
    <>
      <p className="relatorio__subtitulo">Já estão no currículo</p>
      <div className="relatorio__etiquetas">
        {presentes.length ? presentes.map((p) => <Etiqueta key={p.termo} tom="salvia">✓ {p.termo}</Etiqueta>) : 'Nenhuma ainda.'}
      </div>
      <p className="relatorio__subtitulo">Faltam no currículo</p>
      <ul className="relatorio__lista">
        {ausentes.map((palavra) => (
          <li key={palavra.termo}>
            <Etiqueta tom="lavanda">{palavra.termo}</Etiqueta> {palavra.sugestao}
          </li>
        ))}
      </ul>
    </>
  )
}

function ProjetosComoExperiencia({ projetos }) {
  return projetos.map((projeto) => (
    <div key={projeto.projeto} className="relatorio__projeto">
      <p className="relatorio__subtitulo">{projeto.projeto}</p>
      <p>{projeto.porqueConta}</p>
      <p className="relatorio__subtitulo">Como escrever como experiência prática</p>
      <ul className="relatorio__lista">
        {projeto.reescritaSugerida.map((linha) => (
          <li key={linha}>{linha}</li>
        ))}
      </ul>
    </div>
  ))
}

/**
 * Relatório de compatibilidade gerado antes de salvar: o que o perfil atende, o que falta
 * e como preencher cada gap sem inventar nada.
 * @param {object} props
 * @param {object} props.relatorio - Resposta de POST /api/ia/compatibilidade.
 */
export default function RelatorioCompatibilidade({ relatorio }) {
  const requisitos = [...relatorio.requisitos].sort((a, b) => STATUS[a.status].ordem - STATUS[b.status].ordem)
  const atendidos = relatorio.requisitos.filter((r) => r.status === 'atende').length
  return (
    <Card as="section" className="relatorio" aria-live="polite">
      <div className="relatorio__placar">
        <ScoreRing valor={relatorio.compatibilidade} tamanho={84} />
        <div>
          <p className="relatorio__titulo">Compatível com a vaga</p>
          <p className="relatorio__resumo">
            Atende {atendidos} de {relatorio.requisitos.length} requisitos. {relatorio.resumo}
          </p>
        </div>
      </div>
      {relatorio.modo === 'demonstracao' && (
        <p className="relatorio__aviso">Modo demonstração: comparação por palavras-chave, sem leitura de contexto.</p>
      )}
      <ul className="relatorio__requisitos">
        {requisitos.map((requisito) => (
          <Requisito key={requisito.requisito} requisito={requisito} />
        ))}
      </ul>
      <Acordeao titulo="Palavras-chave da vaga" aberto extra={`${relatorio.palavrasChave.filter((p) => p.presente).length}/${relatorio.palavrasChave.length}`}>
        <PalavrasChave palavras={relatorio.palavrasChave} />
      </Acordeao>
      {relatorio.projetosComoExperiencia.length > 0 && (
        <Acordeao titulo="Projetos que contam como experiência prática" aberto>
          <ProjetosComoExperiencia projetos={relatorio.projetosComoExperiencia} />
        </Acordeao>
      )}
      {relatorio.pontosFortes.length > 0 && (
        <Acordeao titulo="Seus pontos fortes para esta vaga">
          <ul className="relatorio__lista">
            {relatorio.pontosFortes.map((ponto) => (
              <li key={ponto}>{ponto}</li>
            ))}
          </ul>
        </Acordeao>
      )}
    </Card>
  )
}
