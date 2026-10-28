import './PreviaCurriculo.css'

/** Linha com texto à esquerda e, opcionalmente, à direita (cidade, datas), como no PDF. */
function LinhaDupla({ esquerda, direita, forte }) {
  if (!esquerda && !direita) return null
  return (
    <p className={`previa-doc__linha${forte ? ' previa-doc__linha--forte' : ''}`}>
      <span>{esquerda}</span>
      {direita && <span className="previa-doc__direita">{direita}</span>}
    </p>
  )
}

function Bloco({ bloco }) {
  return (
    <div className="previa-doc__bloco">
      <LinhaDupla esquerda={bloco.titulo} direita={bloco.direita} forte />
      <LinhaDupla esquerda={bloco.subtitulo} direita={bloco.subdireita} />
      {bloco.linhas?.map((linha) => (
        <p key={linha}>{linha}</p>
      ))}
      {bloco.bullets?.length > 0 && (
        <ul className="previa-doc__bullets">
          {bloco.bullets.map((bullet, indice) => (
            <li key={`${indice}-${bullet}`}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Prévia do currículo exatamente como sai no PDF: uma coluna, títulos padrão, sem ícones.
 * Recebe o documento montado pela API (mesma montagem da exportação).
 * @param {object} props
 * @param {object} props.documento - `documento` de POST /api/curriculos/previa-ats.
 */
export default function PreviaCurriculo({ documento }) {
  return (
    <article className="previa-doc" aria-label="Prévia do currículo">
      <header className="previa-doc__cabecalho">
        <p className="previa-doc__nome">{documento.nome}</p>
        {documento.contatos.length > 0 && <p>{documento.contatos.join('  |  ')}</p>}
        {documento.links.length > 0 && <p>{documento.links.map((link) => link.texto).join('  |  ')}</p>}
      </header>
      {documento.secoes.map((secao) => (
        <section key={secao.id} className="previa-doc__secao">
          <h3 className="previa-doc__titulo">{secao.titulo}</h3>
          {secao.blocos.map((bloco, indice) => (
            <Bloco key={indice} bloco={bloco} />
          ))}
        </section>
      ))}
    </article>
  )
}
