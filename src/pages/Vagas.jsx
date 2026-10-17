import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Etiqueta from '../components/common/Etiqueta'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusTag from '../components/common/StatusTag'
import NovaCandidatura from '../components/vagas/NovaCandidatura'
import useApi from '../hooks/useApi'
import { extrairMensagemErro } from '../services/api'
import { STATUS_VAGA, atualizarVaga, excluirVaga, listarVagas } from '../services/vagaService'
import { formatarData } from '../utils/formatarData'
import './Vagas.css'

const ROTULOS = { aplicado: 'Aplicado', entrevista: 'Entrevista', oferta: 'Oferta', rejeitado: 'Rejeitado' }

/** Um cartão do quadro: empresa, cargo, compatibilidade, currículo usado e ações. */
function CartaoVaga({ vaga, aoMover, aoExcluir }) {
  return (
    <li className="cartao-vaga">
      <div className="cartao-vaga__topo">
        <p className="cartao-vaga__empresa">{vaga.empresa}</p>
        {vaga.compatibilidade != null && <Etiqueta tom="salvia">{vaga.compatibilidade}%</Etiqueta>}
      </div>
      <p className="cartao-vaga__cargo">{vaga.cargo}</p>
      {vaga.notas && <p className="cartao-vaga__notas">{vaga.notas}</p>}
      <p className="cartao-vaga__data">
        Desde {formatarData(vaga.aplicadoEm)}
        {vaga.curriculoId && (
          <>
            {' · '}
            <Link to={`/curriculos/${vaga.curriculoId}/editar`}>currículo enviado</Link>
          </>
        )}
      </p>
      <div className="cartao-vaga__acoes">
        {/* Mudar a etapa por select funciona com teclado e leitor de tela, sem arrastar */}
        <label className="sr-only" htmlFor={`etapa-${vaga.id}`}>
          Etapa de {vaga.empresa}
        </label>
        <select id={`etapa-${vaga.id}`} className="cartao-vaga__etapa" value={vaga.status} onChange={(e) => aoMover(vaga, e.target.value)}>
          {STATUS_VAGA.map((status) => (
            <option key={status} value={status}>
              {ROTULOS[status]}
            </option>
          ))}
        </select>
        <Button variant="perigo" size="sm" onClick={() => aoExcluir(vaga)} aria-label={`Excluir candidatura ${vaga.empresa}`}>
          Excluir
        </Button>
      </div>
    </li>
  )
}

/** Quadro com as 4 etapas. Guarda uma cópia local para mover cartões sem recarregar tudo. */
function Quadro({ vagasIniciais }) {
  const [vagas, setVagas] = useState(vagasIniciais)
  const [erro, setErro] = useState('')

  async function mover(vaga, status) {
    try {
      const atualizada = await atualizarVaga(vaga.id, { status })
      setVagas((atuais) => atuais.map((item) => (item.id === vaga.id ? atualizada : item)))
    } catch (falha) {
      setErro(extrairMensagemErro(falha))
    }
  }

  async function excluir(vaga) {
    if (!window.confirm(`Excluir a candidatura em ${vaga.empresa}?`)) return
    try {
      await excluirVaga(vaga.id)
      setVagas((atuais) => atuais.filter((item) => item.id !== vaga.id))
    } catch (falha) {
      setErro(extrairMensagemErro(falha))
    }
  }

  return (
    <>
      {erro && (
        <p className="mensagem-envio mensagem-envio--erro" role="alert">
          {erro}
        </p>
      )}
      <div className="quadro-vagas">
        {STATUS_VAGA.map((status) => {
          const daEtapa = vagas.filter((vaga) => vaga.status === status)
          return (
            <section key={status} className="coluna-vagas" aria-label={`Etapa ${ROTULOS[status]}`}>
              <header className="coluna-vagas__topo">
                <StatusTag status={status} />
                <span className="coluna-vagas__total">{daEtapa.length}</span>
              </header>
              {daEtapa.length === 0 ? (
                <p className="coluna-vagas__vazia">Nenhuma vaga nesta etapa.</p>
              ) : (
                <ul className="coluna-vagas__lista">
                  {daEtapa.map((vaga) => (
                    <CartaoVaga key={vaga.id} vaga={vaga} aoMover={mover} aoExcluir={excluir} />
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}

/** Página "Candidaturas": tracker por etapa (RF11, RF12, RF13). */
export default function Vagas() {
  const { data, loading, error, recarregar } = useApi(listarVagas)

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <h1 className="page__title">Candidaturas</h1>
          <p className="page__lead">Acompanhe cada vaga da inscrição à oferta e mude a etapa quando tiver novidade.</p>
        </div>
        <NovaCandidatura aoCriar={recarregar} />
      </header>
      {loading && <LoadingSpinner label="Carregando candidaturas…" />}
      {error && (
        <EmptyState
          tone="error"
          title="Não foi possível carregar as candidaturas"
          description={error}
          action={<Button variant="secondary" onClick={recarregar}>Tentar de novo</Button>}
        />
      )}
      {data?.length === 0 && (
        <EmptyState title="Nenhuma candidatura ainda" description="Adicione a primeira com o botão “Nova candidatura” ou ao salvar uma versão otimizada." />
      )}
      {/* key: quando a lista é recarregada, o quadro recomeça com os dados novos */}
      {data?.length > 0 && <Quadro key={JSON.stringify(data.map((vaga) => vaga.id))} vagasIniciais={data} />}
    </section>
  )
}
