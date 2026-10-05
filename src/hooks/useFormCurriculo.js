import { useState } from 'react'
import { extrairMensagemErro } from '../services/api'
import { criarCurriculo } from '../services/curriculoService'
import { separarHabilidades } from '../utils/separarHabilidades'

const FORMULARIO_VAZIO = {
  nome: '',
  email: '',
  cargoAlvo: '',
  resumo: '',
  formacao: '',
  habilidades: '',
  experiencias: [],
}

// Chave estável por experiência: com o índice como key, remover um item do meio
// faria o React reaproveitar os campos errados.
let proximaChave = 1
const novaExperiencia = () => ({ chave: proximaChave++, cargo: '', empresa: '', periodo: '', descricao: '' })

/**
 * Mesmas regras do backend, para avisar o usuário antes de enviar.
 * @param {typeof FORMULARIO_VAZIO} valores
 * @returns {Record<string, string>} Erros por campo; vazio quando está tudo certo.
 */
function validarCurriculo(valores) {
  const erros = {}
  if (!valores.nome.trim()) erros.nome = 'Informe seu nome.'
  if (!valores.cargoAlvo.trim()) erros.cargoAlvo = 'Informe o cargo que você busca.'
  if (valores.email.trim() && !/^\S+@\S+\.\S+$/.test(valores.email.trim())) {
    erros.email = 'Informe um e-mail válido, como voce@email.com.'
  }
  valores.experiencias.forEach((experiencia) => {
    if (!experiencia.cargo.trim() || !experiencia.empresa.trim()) {
      erros[`experiencia-${experiencia.chave}`] = 'Preencha cargo e empresa, ou remova esta experiência.'
    }
  })
  return erros
}

/** Converte o estado do formulário no corpo que POST /api/curriculos espera. */
function montarCorpo(valores) {
  const experiencias = valores.experiencias.map(({ chave: _chave, ...dados }) => dados)
  return { ...valores, experiencias, habilidades: separarHabilidades(valores.habilidades) }
}

/**
 * Ações sobre a lista de experiências, separadas para o hook principal ficar curto.
 * @param {Function} setValores - Setter do estado do formulário.
 */
function criarAcoesExperiencia(setValores) {
  const alterarLista = (transformar) =>
    setValores((atual) => ({ ...atual, experiencias: transformar(atual.experiencias) }))

  return {
    atualizarExperiencia: (chave, campo, valor) =>
      alterarLista((lista) => lista.map((item) => (item.chave === chave ? { ...item, [campo]: valor } : item))),
    adicionarExperiencia: () => alterarLista((lista) => [...lista, novaExperiencia()]),
    removerExperiencia: (chave) => alterarLista((lista) => lista.filter((item) => item.chave !== chave)),
  }
}

/**
 * Estado, validação e envio do formulário de currículo.
 * Fica fora da página para que o componente só cuide da apresentação.
 */
export default function useFormCurriculo() {
  const [valores, setValores] = useState(FORMULARIO_VAZIO)
  const [erros, setErros] = useState({})
  const [envio, setEnvio] = useState({ status: 'ocioso', mensagem: '' })

  const atualizarCampo = ({ target }) => setValores((atual) => ({ ...atual, [target.name]: target.value }))

  const acoesExperiencia = criarAcoesExperiencia(setValores)

  async function enviar(evento) {
    evento.preventDefault()
    const errosEncontrados = validarCurriculo(valores)
    setErros(errosEncontrados)
    if (Object.keys(errosEncontrados).length > 0) return

    setEnvio({ status: 'enviando', mensagem: '' })
    try {
      const criado = await criarCurriculo(montarCorpo(valores))
      setEnvio({ status: 'sucesso', mensagem: `Currículo "${criado.cargoAlvo}" salvo com pontuação ${criado.pontuacao}/100.` })
      setValores(FORMULARIO_VAZIO)
    } catch (erro) {
      setEnvio({ status: 'erro', mensagem: extrairMensagemErro(erro) })
    }
  }

  return { valores, erros, envio, atualizarCampo, enviar, ...acoesExperiencia }
}
