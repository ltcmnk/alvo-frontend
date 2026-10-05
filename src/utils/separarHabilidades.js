/**
 * Transforma o texto "React, Node.js,  SQL" na lista ["React", "Node.js", "SQL"].
 * @param {string} texto - Habilidades separadas por vírgula.
 * @returns {string[]} Habilidades sem espaços extras e sem itens vazios.
 */
export function separarHabilidades(texto) {
  return texto
    .split(',')
    .map((habilidade) => habilidade.trim())
    .filter(Boolean)
}
