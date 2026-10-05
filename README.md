# alvo-frontend

Frontend do **Alvo**, plataforma que cria e otimiza currículos com foco em sistemas ATS e acompanha
as candidaturas do usuário, da inscrição ao contrato.

Nesta **Sprint 1 (Semana 1)** o frontend entrega a base: rotas navegáveis, componentes do design
system, layout mobile-first e integração real com a API (status, listagem e criação de currículos,
listagem de vagas). A comparação currículo × vaga roda como simulação por palavras-chave; a
versão com IA entra nas próximas sprints.

- API: [alvo-api](https://github.com/<organizacao>/alvo-api)
- Documentação do produto: [docs/](./docs)
- Guia do time: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 19 | Interface |
| Vite 8 | Servidor de desenvolvimento e build |
| React Router 7 (`react-router-dom`) | Rotas entre páginas |
| Axios | Requisições HTTP para a API |
| CSS puro com variáveis | Estilos mobile-first, sem framework |
| oxlint | Lint |

## Pré-requisitos

- Node.js **20.19 ou superior** (`node -v`)
- A [alvo-api](https://github.com/ltcmnk/alvo-api) rodando em `http://localhost:3001`
  (sem ela, o app abre normalmente e mostra o aviso de API desconectada)

## Como rodar localmente

```bash
git clone https://github.com/<organizacao>/alvo-frontend.git
cd alvo-frontend
npm install
cp .env.example .env      # no Windows (PowerShell): copy .env.example .env
npm run dev
```

Acesse **http://localhost:5173**. Com a API ligada, a Home mostra "API conectada".

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve o build localmente para conferência |
| `npm run lint` | Verifica o código com oxlint |

### Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3001/api` | Endereço base da API |

> **Por que `VITE_API_URL` e não `REACT_APP_API_URL`?** O exemplo do requisito usa
> `process.env.REACT_APP_API_URL`, que é a sintaxe do Create React App. Este projeto usa Vite,
> que só expõe ao navegador variáveis com prefixo `VITE_`, lidas por `import.meta.env`.
> Com `REACT_APP_` a variável chegaria vazia.

## Rotas

| Rota | Página | O que faz |
| --- | --- | --- |
| `/` | `Home` | Apresentação, atalhos e status da conexão com a API |
| `/curriculos` | `Curriculos` | Lista de currículos com pontuação (GET `/api/curriculos`) |
| `/curriculos/novo` | `CriarCurriculo` | Formulário com prévia ao vivo (POST `/api/curriculos`) |
| `/otimizar` | `Otimizar` | Compara um currículo com a descrição de uma vaga |
| `/vagas` | `Vagas` | Candidaturas agrupadas por etapa (GET `/api/vagas`) |
| qualquer outra | `NotFound` | Página 404 |

## Estrutura de pastas

```
alvo-frontend/
├── docs/                          # Escopo do MVP, requisitos, user stories, wireframes, backlog
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx             # Logo + navegação; menu recolhível no celular
│   │   ├── Navigation.jsx         # Links principais com destaque da página atual
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx             # Moldura comum: Header + página atual + Footer
│   │   ├── ApiStatus.jsx          # Teste de integração: GET /api/health
│   │   ├── common/                # Componentes reutilizáveis do design system
│   │   │   ├── Button.jsx         # primary · secondary · ghost; vira <Link> com "to"
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx     # Lista vazia ou erro, sempre com próximo passo
│   │   │   ├── FormField.jsx      # Rótulo + campo + dica + erro, acessível
│   │   │   ├── ScoreRing.jsx      # Anel de pontuação 0–100
│   │   │   └── StatusTag.jsx      # Etiqueta da etapa da candidatura
│   │   ├── curriculo/             # Peças do formulário de currículo
│   │   └── otimizacao/            # Relatório de compatibilidade
│   ├── pages/                     # Uma página por rota (+ CSS da página)
│   ├── services/                  # Comunicação com a API e regras de negócio
│   │   ├── api.js                 # Instância do axios + tradução de erros
│   │   ├── healthService.js
│   │   ├── curriculoService.js
│   │   ├── vagaService.js
│   │   └── otimizacaoService.js   # Análise por palavras-chave (simulação da IA)
│   ├── hooks/
│   │   ├── useApi.js              # { data, loading, error, recarregar } sem repetir try/catch
│   │   └── useFormCurriculo.js    # Estado, validação e envio do formulário
│   ├── utils/                     # Funções puras: datas, habilidades
│   ├── styles/
│   │   ├── variables.css          # Tokens: cores, fontes, raios, sombras, breakpoints
│   │   ├── globals.css            # Reset e base mobile-first
│   │   └── App.css                # Casca do app, cabeçalho de página e grade
│   ├── App.jsx                    # Mapa de rotas
│   └── main.jsx                   # Ponto de entrada
├── .env.example
├── .gitignore
├── index.html
├── vite.config.js
├── CONTRIBUTING.md
└── README.md
```

Componentes de um só uso ficam junto da funcionalidade (`curriculo/`, `otimizacao/`); os
reutilizáveis ficam em `common/`. O CSS de cada componente mora ao lado do `.jsx`.

## Responsividade

Mobile-first: a base vale para o celular e os `@media (min-width)` só acrescentam.
Breakpoints: **480px**, **768px**, **1024px** e **1440px**. Testado em 375px, 768px e 1440px,
sem scroll horizontal e sem erros no console.

## Design system

Tokens em `src/styles/variables.css`: fundo creme `#FAFAF7`, cards brancos, tinta `#1A1A17`,
acento sálvia `#A9DB6B`, manteiga `#F4E08A`, lavanda `#EFEDFB` e as cores de status das
candidaturas. Tipografia: Fraunces (títulos), Geist (interface) e Geist Mono (rótulos).

## Boas práticas adotadas

- Lógica fora dos componentes: chamadas e regras em `services/`, estado de formulário em `hooks/`.
- Estados de carregando, erro (com "Tentar de novo") e vazio em todas as telas que usam a API.
- Componentes pequenos, PascalCase para componentes e camelCase para funções e variáveis.
- JSDoc nas funções principais; comentários explicam o porquê.
- Acessibilidade: rótulos ligados aos campos, `aria-current` na navegação, foco visível,
  atalho "Pular para o conteúdo" e respeito a `prefers-reduced-motion`.

## Equipe

<!-- Preencher: nome — papel — GitHub -->
| Integrante | Papel |
| --- | --- |
| | Líder / Produto |
| | |

> A base deste projeto foi estruturada com apoio de IA (Claude, da Anthropic) e revisada,
> testada e versionada pela equipe.
