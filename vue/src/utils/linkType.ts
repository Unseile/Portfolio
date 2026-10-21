export type LinkKind = 'pdf' | 'image' | 'link'

const PDF = /\.pdf(?:[?#].*)?$/i
const IMAGE = /\.(?:png|jpe?g|webp|gif|avif|svg)(?:[?#].*)?$/i

export function getLinkKind(href: string): LinkKind {
  if (PDF.test(href)) return 'pdf'
  if (IMAGE.test(href)) return 'image'
  return 'link'
}