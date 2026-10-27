import { useState } from 'react'
import { extrairMensagemErro } from '../services/api'
import { atualizarCurriculo, criarCurriculo } from '../services/curriculoService'
import { curriculoVazio, novoItem, paraApi } from '../utils/curriculo'

const EMAIL = /^\S+@\S+\.\S+$/
const ehUrl = (texto) => /^https?:\/\/\S+\.\S+/.test(texto)

// O que cada item de lista precisa ter, com a mensagem que aparece embaixo dele
const OBRIGATORIOS_ITEM = {
  experiencias: [['cargo', 'empresa'], 'Preencha cargo e empresa, ou remova esta experiência.'],
  formacoes: [['curso', 'instituicao'], 'Preencha curso e instituição, ou remova esta formação.'],
  projetos: [['nome'], 'Dê um nome ao projeto, ou remova-o.'],
  idiomas: [['idioma'], 'Informe o idioma, ou remova-o.'],
  certificacoes: [['nome'], 'Informe o nome da certificação, ou remova-a.'],
}

/** Erros dos itens das listas, por "<lista>-<chave>". */
function validarItens(valores) {
  const erros = {}
  Object.entries(OBRIGATORIOS_ITEM).forEach(([lista, [campos, mensagem]]) => {
    valores[lista].forEach((item) => {
      if (campos.some((campo) => !item[campo].trim())) erros[`${lista}-${item.chave}`] = mensagem
      else if (item.inicio && item.fim && !item.atual && item.fim < item.inicio) {
        erros[`${lista}-${item.chave}`] = 'A data de fim está antes da data de início.'
      } else if (item.link && !ehUrl(item.link)) erros[`${lista}-${item.chave}`] = 'O link precisa começar com https://'
    })
  })
  return erros
}

/**
 * Mesmas regras do backend, para avisar o usuário antes de enviar.
 * @returns {Record<string, string>} Erros por campo; vazio quando está tudo certo.
 */
export function validarCurriculo(valores) {
  const erros = {}
  if (!valores.nome.trim()) erros.nome = 'Informe seu nome.'
  if (!valores.cargoAlvo.trim()) erros.cargoAlvo = 'Informe o cargo que você busca.'
  if (valores.email.trim() && !EMAIL.test(valores.email.trim())) erros.email = 'Informe um e-mail válido, como voce@email.com.'
  ;['linkedin', 'github', 'portfolio'].forEach((campo) => {
    if (valores[campo].trim() && !ehUrl(valores[campo].trim())) erros[campo] = 'O link precisa começar com https://'
  })
  return { ...erros, ...validarItens(valores) }
}

/**
 * Lê ou troca um campo pelo caminho: "resumo" ou "experiencias.<chave>.descricao".
 * O caminho identifica o campo na revisão ortográfica, que só olha o que o usuário editou.
 */
function aplicarNoCaminho(valores, caminho, valor) {
  const [campo, chave, subcampo] = caminho.split('.')
  if (!chave) return { ...valores, [campo]: valor }
  return {
    ...valores,
    [campo]: valores[campo].map((item) => (String(item.chave) === chave ? { ...item, [subcampo]: valor } : item)),
  }
}

export function lerCaminho(valores, caminho) {
  const [campo, chave, subcampo] = caminho.split('.')
  if (!chave) return valores[campo] ?? ''
  return valores[campo].find((item) => String(item.chave) === chave)?.[subcampo] ?? ''
}

/** Ações sobre as listas (experiências, formações, projetos, idiomas, certificações). */
function criarAcoesLista(setValores, marcarEditado) {
  const alterarLista = (lista, transformar) => setValores((atual) => ({ ...atual, [lista]: transformar(atual[lista]) }))
  return {
    atualizarItem: (lista, chave, campo, valor) => {
      alterarLista(lista, (itens) => itens.map((item) => (item.chave === chave ? { ...item, [campo]: valor } : item)))
      marcarEditado(`${lista}.${chave}.${campo}`)
    },
    adicionarItem: (lista) => alterarLista(lista, (itens) => [...itens, novoItem(lista)]),
    removerItem: (lista, chave) => alterarLista(lista, (itens) => itens.filter((item) => item.chave !== chave)),
  }
}

/**
 * Estado, validação e envio do formulário de currículo, usado na criação e no editor.
 * @param {object} [inicial] - Valores iniciais (já no formato do formulário, ver paraFormulario).
 * @param {{ id?: number, extras?: object }} [opcoes] - `id` para salvar com PUT; `extras` vão junto no corpo
 *   (ex.: tipo "otimizado" e a vaga, quando o currículo vem da otimização).
 */
export default function useFormCurriculo(inicial, opcoes = {}) {
  const [valores, setValores] = useState(() => inicial ?? curriculoVazio())
  const [erros, setErros] = useState({})
  const [envio, setEnvio] = useState({ status: 'ocioso', mensagem: '', salvo: null })
  // Campos que o usuário mudou: a revisão ortográfica olha só para eles
  const [editados, setEditados] = useState(() => new Set())
  const marcarEditado = (caminho) => setEditados((atual) => (atual.has(caminho) ? atual : new Set(atual).add(caminho)))

  const atualizarCampo = ({ target }) => {
    setValores((atual) => ({ ...atual, [target.name]: target.value }))
    marcarEditado(target.name)
  }

  /** Troca o valor de um campo pelo caminho (usado ao aplicar uma correção ortográfica). */
  const definirCampo = (caminho, valor) => setValores((atual) => aplicarNoCaminho(atual, caminho, valor))

  /** Substitui o formulário inteiro (ex.: com o que foi lido de um PDF). */
  const substituir = (novos) => {
    setValores(novos)
    setErros({})
  }

  /** Valida e mostra os erros nos campos. @returns {boolean} true se está tudo certo. */
  function validar() {
    const errosEncontrados = validarCurriculo(valores)
    setErros(errosEncontrados)
    return Object.keys(errosEncontrados).length === 0
  }

  async function enviar(evento) {
    evento?.preventDefault()
    if (!validar()) return null

    setEnvio({ status: 'enviando', mensagem: '', salvo: null })
    try {
      const corpo = { ...paraApi(valores), ...opcoes.extras }
      const salvo = opcoes.id ? await atualizarCurriculo(opcoes.id, corpo) : await criarCurriculo(corpo)
      setEnvio({ status: 'sucesso', mensagem: `Currículo "${salvo.cargoAlvo}" salvo com nota ATS ${salvo.pontuacao}/100.`, salvo })
      setEditados(new Set())
      return salvo
    } catch (erro) {
      setEnvio({ status: 'erro', mensagem: extrairMensagemErro(erro), salvo: null })
      return null
    }
  }

  return {
    valores,
    erros,
    envio,
    editados,
    atualizarCampo,
    definirCampo,
    substituir,
    validar,
    enviar,
    ...criarAcoesLista(setValores, marcarEditado),
  }
}
