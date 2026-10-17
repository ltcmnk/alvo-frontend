import { useState } from 'react'
import Button from '../components/common/Button'
import Chip from '../components/common/Chip'
import EmptyState from '../components/common/EmptyState'
import Etiqueta from '../components/common/Etiqueta'
import LoadingSpinner from '../components/common/LoadingSpinner'
import useApi from '../hooks/useApi'
import { extrairMensagemErro } from '../services/api'
import { excluirCurriculo, listarCurriculos } from '../services/curriculoService'
import { formatarData } from '../utils/formatarData'
import './Curriculos.css'

const TIPOS = {
  base: { rotulo: 'Base', tom: 'neutro' },
  otimizado: { rotulo: 'Otimizado', tom: 'salvia' },
  'sob-medida': { rotulo: 'Sob medida', tom: 'manteiga' },
}

const FILTROS = [{ id: 'todos', rotulo: 'Todos' }, ...Object.entries(TIPOS).map(([id, tipo]) => ({ id, rotulo: tipo.rotulo }))]

/** Miniatura de folha com linhas, como no protótipo (sem imagem real do documento). */
function Miniatura() {
  return (
    <div className="cartao-curriculo__miniatura" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

/** Um currículo da grade: tipo, cargo-alvo, vaga, nota ATS, data e ações. */
function CartaoCurriculo({ curriculo, aoExcluir }) {
  const tipo = TIPOS[curriculo.tipo] ?? TIPOS.base
  const subtitulo = curriculo.vagaAlvo?.cargo
    ? `Para: ${curriculo.vagaAlvo.cargo}${curriculo.vagaAlvo.compatibilidade ? ` · ${curriculo.vagaAlvo.compatibilidade}% compatível` : ''}`
    : curriculo.nome
  return (
    <li className="cartao-curriculo">
      <div className="cartao-curriculo__topo">
        <Miniatura />
        <Etiqueta tom={tipo.tom}>{tipo.rotulo}</Etiqueta>
      </div>
      <div>
        <h2 className="cartao-curriculo__cargo">{curriculo.cargoAlvo}</h2>
        <p className="cartao-curriculo__sub">{subtitulo}</p>
      </div>
      <div className="cartao-curriculo__rodape">
        <p>
          <strong className="cartao-curriculo__nota">{curriculo.pontuacao}</strong>
          <span className="cartao-curriculo__data">/100 · {formatarData(curriculo.atualizadoEm, { day: '2-digit', month: 'short' })}</span>
        </p>
        <div className="cartao-curriculo__acoes">
          <Button to={`/curriculos/${curriculo.id}/editar`} variant="secondary" size="sm">
            Editar
          </Button>
          <Button to={`/otimizar?curriculo=${curriculo.id}`} variant="ghost" size="sm">
            Otimizar
          </Button>
          <Button variant="perigo" size="sm" onClick={() => aoExcluir(curriculo)} aria-label={`Excluir ${curriculo.cargoAlvo}`}>
            Excluir
          </Button>
        </div>
      </div>
    </li>
  )
}

/** Grade com filtro por tipo e exclusão com confirmação. */
function GradeCurriculos({ curriculos, recarregar }) {
  const [filtro, setFiltro] = useState('todos')
  const [erro, setErro] = useState('')
  const visiveis = filtro === 'todos' ? curriculos : curriculos.filter((curriculo) => curriculo.tipo === filtro)

  async function excluir(curriculo) {
    if (!window.confirm(`Excluir o currículo "${curriculo.cargoAlvo}"? Essa ação não pode ser desfeita.`)) return
    try {
      await excluirCurriculo(curriculo.id)
      recarregar()
    } catch (falha) {
      setErro(extrairMensagemErro(falha))
    }
  }

  return (
    <>
      <div className="filtros" role="group" aria-label="Filtrar por tipo">
        {FILTROS.map((opcao) => (
          <Chip key={opcao.id} ativo={filtro === opcao.id} aoClicar={() => setFiltro(opcao.id)}>
            {opcao.rotulo}
          </Chip>
        ))}
      </div>
      {erro && (
        <p className="mensagem-envio mensagem-envio--erro" role="alert">
          {erro}
        </p>
      )}
      {visiveis.length === 0 ? (
        <EmptyState title="Nenhum currículo deste tipo" description="Otimize um currículo para gerar versões otimizadas e sob medida." />
      ) : (
        <ul className="grid grid--3 lista-curriculos">
          {visiveis.map((curriculo) => (
            <CartaoCurriculo key={curriculo.id} curriculo={curriculo} aoExcluir={excluir} />
          ))}
        </ul>
      )}
    </>
  )
}

/** Decide o que mostrar: carregando, erro, lista vazia ou a grade. */
function ConteudoCurriculos({ curriculos, loading, error, recarregar }) {
  if (loading) return <LoadingSpinner label="Carregando currículos…" />
  if (error) {
    return (
      <EmptyState
        tone="error"
        title="Não foi possível carregar os currículos"
        description={error}
        action={
          <Button variant="secondary" onClick={recarregar}>
            Tentar de novo
          </Button>
        }
      />
    )
  }
  if (curriculos.length === 0) {
    return (
      <EmptyState
        title="Você ainda não tem currículos"
        description="Crie o primeiro ou importe o PDF/DOCX que você já tem."
        action={<Button to="/curriculos/novo">Criar currículo</Button>}
      />
    )
  }
  return <GradeCurriculos curriculos={curriculos} recarregar={recarregar} />
}

/** Página "Meus currículos": todas as versões, com nota ATS (GET /api/curriculos). */
export default function Curriculos() {
  const { data, loading, error, recarregar } = useApi(listarCurriculos)

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <h1 className="page__title">Meus currículos</h1>
          <p className="page__lead">Todas as versões que você gerou: base, otimizadas para ATS e sob medida para cada vaga.</p>
        </div>
        <Button to="/curriculos/novo">+ Novo currículo</Button>
      </header>
      <ConteudoCurriculos curriculos={data} loading={loading} error={error} recarregar={recarregar} />
    </section>
  )
}
