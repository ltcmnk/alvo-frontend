import Button from '../components/common/Button'
import Card from '../components/common/Card'
import './Home.css'

const PASSOS = [
  {
    titulo: 'Monte seu currículo',
    texto: 'Preencha dados, formação, experiências e habilidades. A prévia mostra o resultado enquanto você digita.',
  },
  {
    titulo: 'Cole a vaga que você quer',
    texto: 'O Alvo compara a descrição da vaga com o seu currículo e mostra as palavras-chave que faltam.',
  },
  {
    titulo: 'Acompanhe cada candidatura',
    texto: 'Veja em que etapa está cada vaga: aplicado, entrevista, oferta ou rejeitado.',
  },
]

/** Desenho do "alvo" da marca: anéis concêntricos com o centro em sálvia. */
function MarcaAlvo() {
  return (
    <svg className="hero__marca" viewBox="0 0 320 320" aria-hidden="true">
      <circle cx="160" cy="160" r="150" fill="var(--cor-lavanda)" />
      <circle cx="160" cy="160" r="112" fill="var(--cor-superficie)" />
      <circle cx="160" cy="160" r="76" fill="var(--cor-manteiga)" />
      <circle cx="160" cy="160" r="42" fill="var(--cor-salvia)" />
      <circle cx="160" cy="160" r="150" fill="none" stroke="var(--cor-tinta)" strokeWidth="2" />
      <circle cx="160" cy="160" r="9" fill="var(--cor-tinta)" />
    </svg>
  )
}

/** Abertura da página: proposta do Alvo e as duas ações principais. */
function Hero() {
  return (
    <section className="hero">
      <div className="container hero__conteudo">
        <div className="hero__texto">
          <p className="hero__rotulo">Currículo e candidaturas</p>
          <h1 className="hero__titulo">Seu currículo, ajustado para cada vaga.</h1>
          <p className="hero__descricao">
            O Alvo organiza suas informações profissionais, compara o currículo com a vaga e aponta
            o que ajustar para passar pelos filtros de seleção automática (ATS).
          </p>
          <div className="hero__acoes">
            <Button to="/curriculos/novo">Criar currículo</Button>
            <Button to="/otimizar" variant="secondary">
              Otimizar para uma vaga
            </Button>
          </div>
        </div>
        <MarcaAlvo />
      </div>
      <div className="hero__colinas" aria-hidden="true" />
    </section>
  )
}

/** Os três passos do uso do Alvo; a numeração reflete a ordem real do fluxo. */
function ComoFunciona() {
  return (
    <section className="container passos" aria-labelledby="titulo-passos">
      <h2 id="titulo-passos" className="passos__titulo">
        Como funciona
      </h2>
      <ol className="grid grid--3 passos__lista">
        {PASSOS.map((passo, indice) => (
          <Card as="li" key={passo.titulo} className="passo">
            <span className="passo__numero">{indice + 1}</span>
            <h3 className="passo__titulo">{passo.titulo}</h3>
            <p className="passo__texto">{passo.texto}</p>
          </Card>
        ))}
      </ol>
    </section>
  )
}

/** Página inicial: apresenta o Alvo e leva às duas ações principais. */
export default function Home() {
  return (
    <>
      <Hero />
      <ComoFunciona />
    </>
  )
}