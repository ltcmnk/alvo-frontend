/*
 * Conversões entre o currículo da API e o estado do formulário.
 * O formulário guarda tudo como texto (inputs controlados não aceitam undefined) e cada item de
 * lista ganha uma `chave` estável; a API recebe listas de verdade e sem campos vazios.
 */
import { separarHabilidades } from './separarHabilidades'

export const SITUACOES_FORMACAO = [
  { valor: 'concluido', rotulo: 'Concluído' },
  { valor: 'cursando', rotulo: 'Em andamento' },
  { valor: 'trancado', rotulo: 'Trancado' },
]

export const CONTEXTOS_PROJETO = [
  { valor: 'academico', rotulo: 'Acadêmico' },
  { valor: 'pessoal', rotulo: 'Pessoal' },
  { valor: 'voluntario', rotulo: 'Voluntário' },
  { valor: 'profissional', rotulo: 'Profissional' },
]

export const NIVEIS_IDIOMA = [
  { valor: 'basico', rotulo: 'Básico' },
  { valor: 'intermediario', rotulo: 'Intermediário' },
  { valor: 'avancado', rotulo: 'Avançado' },
  { valor: 'fluente', rotulo: 'Fluente' },
  { valor: 'nativo', rotulo: 'Nativo' },
]

// Chave estável por item: com o índice como key, remover um item do meio
// faria o React reaproveitar os campos errados.
let proximaChave = 1
const comChave = (item) => ({ ...item, chave: proximaChave++ })

/** Item em branco de cada lista do formulário. */
export const ITENS_VAZIOS = {
  experiencias: () => ({ cargo: '', empresa: '', local: '', inicio: '', fim: '', atual: false, descricao: '' }),
  formacoes: () => ({ curso: '', instituicao: '', inicio: '', fim: '', situacao: 'concluido' }),
  projetos: () => ({ nome: '', contexto: 'academico', descricao: '', tecnologias: '', link: '' }),
  idiomas: () => ({ idioma: '', nivel: 'intermediario' }),
  certificacoes: () => ({ nome: '', instituicao: '', ano: '' }),
}

export const novoItem = (lista) => comChave(ITENS_VAZIOS[lista]())

const CAMPOS_TEXTO = ['nome', 'cargoAlvo', 'email', 'telefone', 'cidade', 'linkedin', 'github', 'portfolio', 'resumo']

/** Estado inicial do formulário vazio. */
export function curriculoVazio() {
  return {
    ...Object.fromEntries(CAMPOS_TEXTO.map((campo) => [campo, ''])),
    experiencias: [],
    formacoes: [],
    projetos: [],
    idiomas: [],
    certificacoes: [],
    habilidades: '',
    competencias: '',
    atividades: '',
  }
}

/** Troca undefined por '' e acrescenta a chave, para o item virar campos controlados. */
function itemParaFormulario(lista, item) {
  const vazio = ITENS_VAZIOS[lista]()
  const preenchido = Object.fromEntries(Object.keys(vazio).map((campo) => [campo, item[campo] ?? vazio[campo]]))
  if (lista === 'projetos') preenchido.tecnologias = (item.tecnologias ?? []).join(', ')
  return comChave(preenchido)
}

/**
 * Currículo vindo da API (ou da IA, ou da leitura de arquivo) → estado do formulário.
 * @param {object} curriculo
 */
export function paraFormulario(curriculo) {
  const listas = Object.keys(ITENS_VAZIOS)
  return {
    ...curriculoVazio(),
    ...Object.fromEntries(CAMPOS_TEXTO.map((campo) => [campo, curriculo[campo] ?? ''])),
    ...Object.fromEntries(listas.map((lista) => [lista, (curriculo[lista] ?? []).map((item) => itemParaFormulario(lista, item))])),
    habilidades: (curriculo.habilidades ?? []).join(', '),
    competencias: (curriculo.competencias ?? []).join(', '),
    atividades: (curriculo.atividades ?? []).join('\n'),
  }
}

/** Remove a chave, apara textos e descarta campos vazios (a API trata ausente como "não informado"). */
function limparItem(item) {
  const { chave: _chave, ...dados } = item
  return Object.fromEntries(
    Object.entries(dados)
      .map(([campo, valor]) => [campo, typeof valor === 'string' ? valor.trim() : valor])
      .filter(([, valor]) => valor !== '' && valor !== false),
  )
}

// Item com só valores padrão (ex.: nível do idioma) não conta como preenchido
const CAMPOS_PADRAO = new Set(['situacao', 'contexto', 'nivel'])
const itemPreenchido = (item) => Object.entries(item).some(([campo, valor]) => !CAMPOS_PADRAO.has(campo) && valor)

/**
 * Estado do formulário → corpo que a API espera (POST/PUT, prévia ATS e IA).
 * @param {ReturnType<typeof curriculoVazio>} valores
 */
export function paraApi(valores) {
  const listas = Object.keys(ITENS_VAZIOS)
  const corpo = limparItem(Object.fromEntries(CAMPOS_TEXTO.map((campo) => [campo, valores[campo]])))
  listas.forEach((lista) => {
    corpo[lista] = valores[lista].map(limparItem).filter(itemPreenchido)
  })
  corpo.projetos = corpo.projetos.map((projeto) => ({ ...projeto, tecnologias: separarHabilidades(projeto.tecnologias ?? '') }))
  corpo.habilidades = separarHabilidades(valores.habilidades)
  corpo.competencias = separarHabilidades(valores.competencias)
  corpo.atividades = valores.atividades.split('\n').map((linha) => linha.trim()).filter(Boolean)
  return corpo
}

const METADADOS = ['id', 'tipo', 'pontuacao', 'atualizadoEm', 'vagaAlvo', 'origemId']

/** Só o conteúdo de um currículo salvo, sem id e metadados: é o que a IA e a prévia recebem. */
export function conteudoDoCurriculo(curriculo) {
  return Object.fromEntries(Object.entries(curriculo).filter(([campo]) => !METADADOS.includes(campo)))
}
