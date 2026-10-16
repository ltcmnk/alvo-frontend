import './Footer.css'

// Calculado uma vez ao carregar o módulo: o ano não muda durante o uso
const ANO_ATUAL = new Date().getFullYear()

/** Rodapé com a identificação do projeto. */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__conteudo">
        <p className="footer__marca">alvo</p>
        <p className="footer__texto">
          Projeto acadêmico, Sprint 2. Os dados são de exemplo e ficam só na memória da API.
        </p>
        <p className="footer__texto">© {ANO_ATUAL} Equipe Alvo</p>
      </div>
    </footer>
  )
}
