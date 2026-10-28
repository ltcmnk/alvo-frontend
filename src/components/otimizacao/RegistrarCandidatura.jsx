import { useState } from 'react'
import Button from '../common/Button'
import FormField from '../common/FormField'
import { extrairMensagemErro } from '../../services/api'
import { criarVaga } from '../../services/vagaService'

/**
 * Registra no tracker a candidatura feita com a versão salva, já com o % de compatibilidade.
 * @param {object} props
 * @param {number} props.curriculoId
 * @param {number} [props.compatibilidade]
 * @param {string} [props.cargoSugerido] - Título da vaga vindo da análise automática.
 * @param {string} [props.descricaoVaga]
 */
export default function RegistrarCandidatura({ curriculoId, compatibilidade, cargoSugerido = '', descricaoVaga }) {
  const [dados, setDados] = useState({ empresa: '', cargo: cargoSugerido.slice(0, 120), link: '' })
  const [estado, setEstado] = useState({ status: 'ocioso', mensagem: '' })
  const alterar = ({ target }) => setDados((atual) => ({ ...atual, [target.name]: target.value }))

  async function registrar(evento) {
    evento.preventDefault()
    if (!dados.empresa.trim() || !dados.cargo.trim()) {
      setEstado({ status: 'erro', mensagem: 'Informe empresa e cargo.' })
      return
    }
    setEstado({ status: 'enviando', mensagem: '' })
    try {
      await criarVaga({ ...dados, link: dados.link || undefined, curriculoId, compatibilidade, descricao: descricaoVaga })
      setEstado({ status: 'sucesso', mensagem: 'Candidatura registrada como "Aplicado".' })
    } catch (erro) {
      setEstado({ status: 'erro', mensagem: extrairMensagemErro(erro) })
    }
  }

  if (estado.status === 'sucesso') {
    return (
      <div className="mensagem-envio mensagem-envio--sucesso" role="status">
        <p>{estado.mensagem}</p>
        <Button to="/vagas" variant="secondary" size="sm">
          Ver candidaturas
        </Button>
      </div>
    )
  }

  return (
    <form className="registrar-candidatura" onSubmit={registrar} noValidate>
      <p className="titulo-bloco">Já vai se candidatar? Registre no tracker</p>
      <div className="campos-duplos">
        <FormField label="Empresa" name="empresa" value={dados.empresa} onChange={alterar} obrigatorio />
        <FormField label="Cargo" name="cargo" value={dados.cargo} onChange={alterar} obrigatorio />
      </div>
      <FormField label="Link da vaga" name="link" type="url" placeholder="https://" value={dados.link} onChange={alterar} />
      {estado.status === 'erro' && (
        <p className="mensagem-envio mensagem-envio--erro" role="alert">
          {estado.mensagem}
        </p>
      )}
      <Button type="submit" variant="secondary" disabled={estado.status === 'enviando'}>
        Registrar candidatura
      </Button>
    </form>
  )
}
