/*
 * Análise de compatibilidade entre currículo e vaga, feita no navegador.
 *
 * É uma simulação por palavras-chave para a Semana 1: a análise com IA
 * (Must do MoSCoW) entra nas próximas sprints e substitui este cálculo
 * sem mudar o formato do resultado que a página consome.
 */

const LIMITE_PALAVRAS_CHAVE = 12
const MINIMO_LETRAS = 3

// Palavras comuns em qualquer anúncio de vaga, que não dizem nada sobre a competência pedida
const PALAVRAS_IGNORADAS = new Set(
  (
    'para com como que uma umas uns dos das nos nas por pelo pela mais menos sua seu suas seus ' +
    'sobre entre ser ter estar sera sao esta este essa esse isso aos tambem bem muito cada onde ' +
    'quando qual quais nao sim voce voces nossa nosso nossos nossas vaga vagas empresa time equipe ' +
    'area areas experiencia conhecimento conhecimentos desejavel requisitos requisito atividades ' +
    'responsabilidades beneficios diferencial diferenciais buscamos procuramos profissional ' +
    'trabalho trabalhar pessoa pessoas forma anos ano nivel plano saude home office remoto hibrido ' +
    'presencial fazer atuar atuacao oportunidade candidato candidata todos todas principais ' +
    'vai vamos ira iremos desenvolver criar apoiar garantir participar ajudar manter possuir ' +
    'boa bom bons boas vivencia dominio familiaridade capacidade habilidade habilidades ' +
    'the and with for you our will'
  ).split(' '),
)

/**
 * Deixa o texto comparável: minúsculas e sem acentos ("Análise" e "analise" viram iguais).
 * @param {string} texto
 * @returns {string}
 */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Quebra o texto em termos, mantendo "node.js", "back-end", "c#" e "c++" inteiros.
 * @param {string} texto
 * @returns {string[]}
 */
function separarTermos(texto) {
  const termos = normalizar(texto).match(/[a-z0-9][a-z0-9+#.-]*/g) ?? []
  return termos
    .map((termo) => termo.replace(/[.-]+$/, ''))
    .filter((termo) => termo.length >= MINIMO_LETRAS && !PALAVRAS_IGNORADAS.has(termo))
}

/**
 * Escolhe os termos que mais se repetem na vaga: o que aparece mais vezes costuma ser requisito.
 * @param {string} descricaoVaga
 * @returns {string[]} Até 12 palavras-chave, da mais frequente para a menos.
 */
export function extrairPalavrasChave(descricaoVaga) {
  const frequencia = new Map()
  separarTermos(descricaoVaga).forEach((termo) => {
    frequencia.set(termo, (frequencia.get(termo) ?? 0) + 1)
  })
  return [...frequencia.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, LIMITE_PALAVRAS_CHAVE)
    .map(([termo]) => termo)
}

/** Junta tudo o que o currículo diz em um conjunto de termos para consulta rápida. */
function termosDoCurriculo(curriculo) {
  const partes = [
    curriculo.cargoAlvo,
    curriculo.resumo,
    curriculo.formacao,
    ...(curriculo.habilidades ?? []),
    ...(curriculo.experiencias ?? []).flatMap((item) => [item.cargo, item.descricao]),
  ]
  return new Set(separarTermos(partes.filter(Boolean).join(' ')))
}

/** Sugestões práticas a partir do que faltou; sempre retorna pelo menos uma. */
function gerarSugestoes({ curriculo, faltantes, percentual }) {
  const sugestoes = []
  if (faltantes.length > 0) {
    sugestoes.push(`Se fizer parte da sua experiência, inclua estes termos da vaga: ${faltantes.slice(0, 5).join(', ')}.`)
  }
  if (!curriculo.resumo) {
    sugestoes.push('Escreva um resumo de 2 a 3 linhas alinhado ao cargo da vaga.')
  }
  const temNumeros = (curriculo.experiencias ?? []).some((item) => /\d/.test(item.descricao ?? ''))
  if (!temNumeros) {
    sugestoes.push('Mostre resultados com números nas experiências: %, R$, prazos ou quantidade de usuários.')
  }
  if (percentual < 50) {
    sugestoes.push('A compatibilidade está baixa: vale criar uma versão sob medida deste currículo para a vaga.')
  }
  return sugestoes.length > 0 ? sugestoes : ['Bom alinhamento. Coloque primeiro as experiências mais próximas da vaga.']
}

/**
 * Compara um currículo com a descrição de uma vaga (US04 e US05).
 * @param {object} curriculo - Currículo vindo de GET /api/curriculos.
 * @param {string} descricaoVaga - Texto colado pelo usuário.
 * @returns {{ percentual: number, encontradas: string[], faltantes: string[], sugestoes: string[] }}
 */
export function analisarCompatibilidade(curriculo, descricaoVaga) {
  const palavrasChave = extrairPalavrasChave(descricaoVaga)
  const termosCurriculo = termosDoCurriculo(curriculo)
  const encontradas = palavrasChave.filter((termo) => termosCurriculo.has(termo))
  const faltantes = palavrasChave.filter((termo) => !termosCurriculo.has(termo))
  const percentual = palavrasChave.length === 0 ? 0 : Math.round((encontradas.length / palavrasChave.length) * 100)

  return { percentual, encontradas, faltantes, sugestoes: gerarSugestoes({ curriculo, faltantes, percentual }) }
}
