import ApiStatus from '../components/ApiStatus'
import Button from '../components/common/Button'
import './Home.css'

const PASSOS = [
  {
    titulo: 'Monte ou importe seu currículo',
    texto: 'Preencha um formulário completo ou envie o PDF/DOCX que você já tem para aproveitar o conteúdo.',
    tom: 'azul',
  },
  {
    titulo: 'Cole a vaga e veja o relatório',
    texto: 'O Alvo extrai as palavras-chave da vaga e mostra quais requisitos você atende e como fechar os gaps.',
    tom: 'salvia',
  },
  {
    titulo: 'Otimize, revise e envie',
    texto: 'A IA reescreve para o ATS sem inventar nada. Você revisa, exporta em PDF ou DOCX e acompanha a candidatura.',
    tom: 'manteiga',
  },
]

const FERRAMENTAS = [
  { nome: 'Nota ATS de 0 a 100', texto: 'Critérios claros: seções, palavras-chave, impacto e formatação.' },
  { nome: 'Versão sob medida', texto: 'Uma versão para cada vaga, com o % de compatibilidade antes e depois.' },
  { nome: 'Prévia como o ATS lê', texto: 'O texto que o sistema enxerga, os campos que ele extrai e o que pode dar errado.' },
  { nome: 'Tracker de candidaturas', texto: 'Aplicado, entrevista, oferta ou rejeitado, com o currículo usado em cada vaga.' },
]

/** Colinas verdes do protótipo: elipses sobrepostas no rodapé do painel. */
function Colinas() {
  return (
    <div className="colinas" aria-hidden="true">
      <span className="colinas__esquerda" />
      <span className="colinas__direita" />
    </div>
  )
}

/** Abertura: painel "céu" com a proposta do Alvo e as duas ações principais. */
function Hero() {
  return (
    <section className="container hero">
      <div className="hero__painel">
        <p className="hero__rotulo">Currículo, IA e candidaturas</p>
        <h1 className="hero__titulo">
          Seu currículo, <em>no alvo</em> de cada vaga.
        </h1>
        <p className="hero__descricao">
          O Alvo compara seu currículo com a vaga, mostra o que falta e reescreve para passar pelos filtros
          automáticos (ATS), sem inventar nada sobre você.
        </p>
        <div className="hero__acoes">
          <Button to="/curriculos/novo">Criar currículo</Button>
          <Button to="/otimizar" variant="escuro">
            Otimizar para uma vaga
          </Button>
        </div>
        <div className="hero__status">
          <ApiStatus />
        </div>
        <Colinas />
      </div>
    </section>
  )
}

/** Os três passos do uso do Alvo, nas cores do protótipo (azul, sálvia, manteiga). */
function ComoFunciona() {
  return (
    <section className="container secao-home" aria-labelledby="titulo-passos">
      <h2 id="titulo-passos" className="secao-home__titulo">
        Como funciona
      </h2>
      <ol className="grid grid--3 passos">
        {PASSOS.map((passo, indice) => (
          <li key={passo.titulo} className={`passo passo--${passo.tom}`}>
            <span className="passo__numero">{indice + 1}</span>
            <h3 className="passo__titulo">{passo.titulo}</h3>
            <p className="passo__texto">{passo.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** O que o usuário recebe em cada otimização. */
function Ferramentas() {
  return (
    <section className="container secao-home" aria-labelledby="titulo-ferramentas">
      <h2 id="titulo-ferramentas" className="secao-home__titulo">
        Tudo o que a otimização entrega
      </h2>
      <ul className="grid grid--2 ferramentas">
        {FERRAMENTAS.map((ferramenta) => (
          <li key={ferramenta.nome} className="ferramenta">
            <span className="ferramenta__marca" aria-hidden="true" />
            <div>
              <h3 className="ferramenta__nome">{ferramenta.nome}</h3>
              <p className="ferramenta__texto">{ferramenta.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Página inicial: apresenta o Alvo e leva às duas ações principais. */
export default function Home() {
  return (
    <>
      <Hero />
      <ComoFunciona />
      <Ferramentas />
    </>
  )
}
