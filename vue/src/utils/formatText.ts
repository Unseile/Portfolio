const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Couleurs disponibles par leur nom (à ajouter ici et dans le CSS pour en créer d'autres)
const COLORS = ['vert', 'rose', 'bleu', 'jaune']

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

// **gras**                →  <strong>
// ==texte==               →  couleur d'accent du projet
// ==vert:texte==          →  couleur nommée de la palette
// ==#7a3cff:texte==       →  n'importe quelle couleur (code hexadécimal)
export function formatText(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/==(?:([^\s:=]+):)?(.+?)==/g, (_m, name: string | undefined, content: string) => {
      const key = name?.toLowerCase()

      if (key && COLORS.includes(key)) {
        return `<span class="c-${key}">${content}</span>`
      }
      if (name && HEX.test(name)) {
        return `<span style="color:${name}">${content}</span>`
      }
      // Pas une couleur connue : on garde le texte tel quel, avec la couleur du projet
      return `<span class="accent">${name ? `${name}:` : ''}${content}</span>`
    })
}