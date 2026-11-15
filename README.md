# alvo-frontend

Frontend do **Alvo**, plataforma que cria e otimiza currículos com foco em sistemas ATS e acompanha
as candidaturas do usuário, da inscrição ao contrato.

A **Sprint 1** entregou a base (rotas, design system, layout mobile-first e integração com a API).
A **Sprint 2** trouxe o formulário completo, a leitura de PDF/DOCX, a prévia e a nota ATS, a
otimização com IA e o acompanhamento de candidaturas. A **entrega final (versão 2.1)** acrescenta
cadastro e login por e-mail e senha, a página Minha conta, o editor com revisão ortográfica e a
exportação em PDF, DOCX e LaTeX. Os dados ficam salvos no banco da API, separados por conta.

- API: [alvo-api](https://github.com/ltcmnk/alvo-api)
- Documentação do produto: [docs/](./docs)
- Guia do time: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 19 | Interface |
| Vite 8 | Servidor de desenvolvimento e build |
| React Router 7 (`react-router-dom`) | Rotas entre páginas |
| Axios | Requisições HTTP para a API (com o cookie de sessão, `withCredentials`) |
| React Context | Usuário logado disponível para o app inteiro (`Sessao.jsx`) |
| CSS puro com variáveis | Estilos mobile-first, sem framework |
| oxlint | Lint |

## Pré-requisitos

- Node.js **22.13 ou superior** (`node -v`), a mesma versão exigida pela API
- A [alvo-api](https://github.com/ltcmnk/alvo-api) rodando em `http://localhost:3001`
  (sem ela, o app abre normalmente e mostra o aviso de API desconectada)

## Como rodar localmente

```bash
git clone https://github.com/ltcmnk/alvo-frontend.git
cd alvo-frontend
npm install
cp .env.example .env      # no Windows (PowerShell): copy .env.example .env
npm run dev
```

Acesse **http://localhost:5173**, clique em **Entrar → Criar conta** e cadastre-se. Com a API
ligada, a Home mostra "API conectada".

> Abra o site em `localhost` (não em `127.0.0.1`): o cookie de sessão só vale quando o frontend e a
> API usam o mesmo nome de host.

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
Públicas:

| Rota | Página | O que faz |
| --- | --- | --- |
| `/` | `Home` | Apresentação, atalhos e status da conexão com a API |
| `/entrar` · `/cadastro` | `Acesso` | Login e cadastro por e-mail e senha |
| qualquer outra | `NotFound` | Página 404 |

Exigem login (sem sessão, vão para `/entrar` e voltam depois):

| Rota | Página | O que faz |
| --- | --- | --- |
| `/curriculos` | `Curriculos` | Lista com nota ATS, filtro por tipo, PDF e exclusão |
| `/curriculos/novo` | `CriarCurriculo` | Formulário completo com prévia ao vivo e importação de PDF/DOCX |
| `/curriculos/:id/editar` | `EditorCurriculo` | Edita um currículo salvo, revisa a ortografia e exporta |
| `/curriculos/editar` | `EditorCurriculo` | Revisa a versão gerada pela IA antes de salvar |
| `/otimizar` | `Otimizar` | Relatório de compatibilidade com a vaga e otimização com IA |
| `/vagas` | `Vagas` | Candidaturas por etapa, com troca de etapa |
| `/conta` | `Conta` | Nome e e-mail, editar nome, sair e excluir a conta |

Na otimização, a nota ATS **nunca cai**: se a IA piorar uma seção, a API mantém o texto original
dela e a tela avisa quais seções foram mantidas.

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
│   │   ├── Sessao.jsx             # Usuário logado (contexto) e guarda das rotas protegidas
│   │   ├── common/                # Componentes reutilizáveis do design system
│   │   │   ├── Button.jsx         # primary · secondary · ghost; vira <Link> com "to"
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx     # Lista vazia ou erro, sempre com próximo passo
│   │   │   ├── FormField.jsx      # Rótulo + campo + dica + erro, acessível
│   │   │   ├── ScoreRing.jsx      # Anel de pontuação 0–100
│   │   │   └── StatusTag.jsx      # Etiqueta da etapa da candidatura
│   │   ├── curriculo/             # Peças do formulário de currículo
│   │   ├── editor/                # Botões de exportação e revisão ortográfica
│   │   ├── otimizacao/            # Relatório de compatibilidade e resultado da otimização
│   │   └── vagas/                 # Formulário e cartões das candidaturas
│   ├── pages/                     # Uma página por rota (+ CSS da página)
│   ├── services/                  # Comunicação com a API e regras de negócio
│   │   ├── api.js                 # Instância do axios, cookie de sessão e tradução de erros
│   │   ├── sessao.js              # Contexto e hook useSessao
│   │   ├── healthService.js
│   │   ├── curriculoService.js
│   │   ├── vagaService.js
│   │   ├── iaService.js           # Provedores, análise da vaga, relatório e otimização
│   │   ├── documentoService.js    # Leitura de PDF/DOCX
│   │   └── exportacaoService.js   # Download PDF/DOCX/LaTeX e revisão ortográfica
│   ├── hooks/
│   │   ├── useApi.js              # { data, loading, error, recarregar } sem repetir try/catch
│   │   ├── useFormCurriculo.js    # Estado, validação e envio do formulário
│   │   ├── useOtimizacao.js       # Etapas do fluxo de otimização
│   │   └── usePreviaAts.js        # Nota ATS ao vivo enquanto o formulário é preenchido
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
- Segurança: a sessão fica num cookie HttpOnly; o frontend não guarda senha nem token no
  `localStorage`.

## Equipe

| Integrante | GitHub | Papel |
| --- | --- | --- |
| Letícia Miniuk Rosa Pereira | @ltcmnk | Líder: processo, design system e documentação |
| Victor Willian Rodrigues Bittencourt | @scourgeyyy | API: modelo de currículo, nota ATS e IA |
| Karen Cristini Nogueira | @nogueiiiiiiiiira | Editor, exportação, ortografia e candidaturas |
| Rayssa Gaievicz Grafetti | @T-800-888 | Criação de currículo, leitura de arquivo e otimização |

> A base deste projeto foi estruturada com apoio de IA (Claude, da Anthropic) e revisada,
> testada e versionada pela equipe.
