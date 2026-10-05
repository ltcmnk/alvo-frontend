import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ScoreRing from '../components/common/ScoreRing'
import useApi from '../hooks/useApi'
import { listarCurriculos } from '../services/curriculoService'
import { formatarData } from '../utils/formatarData'
import './Curriculos.css'

const ROTULO_TIPO = {
  base: 'Original',
  otimizado: 'Otimizado',
  'sob-medida': 'Sob medida',
}

/** Um currículo da lista: tipo, cargo-alvo, nome, pontuação e data. */
function CartaoCurriculo({ curriculo }) {
  return (
    <Card as="li" className="cartao-curriculo">
      <span className={`cartao-curriculo__tipo cartao-curriculo__tipo--${curriculo.tipo}`}>
        {ROTULO_TIPO[curriculo.tipo] ?? curriculo.tipo}
      </span>
      <h2 className="cartao-curriculo__cargo">{curriculo.cargoAlvo}</h2>
      <p className="cartao-curriculo__nome">{curriculo.nome}</p>
      <div className="cartao-curriculo__rodape">
        <ScoreRing valor={curriculo.pontuacao} tamanho={52} />
        <p className="cartao-curriculo__data">
          Atualizado em {formatarData(curriculo.atualizadoEm)}
        </p>
      </div>
    </Card>
  )
}

/** Decide o que mostrar: carregando, erro, lista vazia ou os cartões. */
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
        description="Crie o primeiro para começar a comparar com vagas."
        action={<Button to="/curriculos/novo">Criar currículo</Button>}
      />
    )
  }

  return (
    <ul className="grid grid--3 lista-curriculos">
      {curriculos.map((curriculo) => (
        <CartaoCurriculo key={curriculo.id} curriculo={curriculo} />
      ))}
    </ul>
  )
}

/** Página "Meus currículos": lista os currículos vindos de GET /api/curriculos. */
export default function Curriculos() {
  const { data, loading, error, recarregar } = useApi(listarCurriculos)

  return (
    <section className="page container">
      <header className="page__header">
        <div>
          <h1 className="page__title">Meus currículos</h1>
          <p className="page__lead">Todas as versões do seu currículo, com a pontuação de cada uma.</p>
        </div>
        <Button to="/curriculos/novo">Novo currículo</Button>
      </header>
      <ConteudoCurriculos curriculos={data} loading={loading} error={error} recarregar={recarregar} />
    </section>
  )
}