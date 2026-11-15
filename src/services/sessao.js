import { createContext, useContext } from 'react'

/** Contexto com o usuário logado; preenchido pelo componente Sessao. */
export const ContextoSessao = createContext(null)

/** Usuário logado e ações de sessão (sair, recarregar). */
export const useSessao = () => useContext(ContextoSessao)
