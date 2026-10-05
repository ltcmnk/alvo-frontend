import './ScoreRing.css'

const RAIO = 26
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

/**
 * Classifica a pontuação para escolher a cor do anel.
 * Abaixo de 70 pede atenção; de 70 a 84 é boa; a partir de 85 é forte.
 * @param {number} valor - Pontuação de 0 a 100.
 * @returns {'baixa'|'boa'|'forte'}
 */
function classificarPontuacao(valor) {
  if (valor >= 85) return 'forte'
  if (valor >= 70) return 'boa'
  return 'baixa'
}

/**
 * Anel que mostra a pontuação do currículo de 0 a 100.
 * @param {object} props
 * @param {number} props.valor - Pontuação; valores fora de 0–100 são ajustados.
 * @param {number} [props.tamanho=64] - Largura e altura em pixels.
 */
export default function ScoreRing({ valor, tamanho = 64 }) {
  const pontuacao = Math.min(100, Math.max(0, Math.round(valor)))
  const preenchido = (pontuacao / 100) * CIRCUNFERENCIA

  return (
    <div
      className={`score-ring score-ring--${classificarPontuacao(pontuacao)}`}
      style={{ width: tamanho, height: tamanho }}
      role="img"
      aria-label={`Pontuação ${pontuacao} de 100`}
    >
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="score-ring__trilho" cx="32" cy="32" r={RAIO} />
        <circle
          className="score-ring__progresso"
          cx="32"
          cy="32"
          r={RAIO}
          strokeDasharray={`${preenchido} ${CIRCUNFERENCIA}`}
        />
      </svg>
      <span className="score-ring__valor">{pontuacao}</span>
    </div>
  )
}