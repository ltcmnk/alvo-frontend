import Button from '../common/Button'

/** Retorno do envio: sucesso com os próximos passos, ou o erro vindo da API. */
export default function MensagemEnvio({ envio }) {
  if (envio.status === 'sucesso') {
    return (
      <div className="mensagem-envio mensagem-envio--sucesso" role="status">
        <p>{envio.mensagem}</p>
        <div className="mensagem-envio__acoes">
          <Button to={`/otimizar?curriculo=${envio.salvo.id}`} variant="escuro" size="sm">
            Otimizar para uma vaga
          </Button>
          <Button to="/curriculos" variant="secondary" size="sm">
            Ver meus currículos
          </Button>
        </div>
      </div>
    )
  }
  if (envio.status === 'erro') {
    return (
      <p className="mensagem-envio mensagem-envio--erro" role="alert">
        {envio.mensagem}
      </p>
    )
  }
  return null
}
