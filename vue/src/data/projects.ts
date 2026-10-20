import hugCover from '../assets/image/mockup_hug.png'
import etoileCover from '../assets/image/etoile_blanche.png'
import noraaCover from '../assets/image/noraa.png'
import visuCover from '../assets/image/visualisation.png'
import modterraCover from '../assets/image/modterra.png'

export interface ProjectMember {
  name: string
  role?: string
}

export interface ProjectImage {
  src: string
  alt: string
  theme?: 'light' | 'dark'   // fond de l'image : dark = menu en blanc
}

export interface ProjectLink {
  label: string
  href: string            // site, PDF dans /public, etc.
}

export interface TextBlock {
  heading?: string
  paragraphs?: string[]
  bullets?: string[]
  links?: ProjectLink[]
}

export interface Project {
  slug: string
  title: string
  summary: string
  cover: string
  color: string
  skills: string[]
  members: string[]       // était { name, role }
  images: [ProjectImage, ProjectImage]
  texts: [TextBlock, TextBlock, TextBlock, TextBlock]
}

// À remplacer par tes vrais textes
const todo: TextBlock = {
  heading: 'Titre de la section',
  paragraphs: ['Texte à remplacer.'],
}

export const projects: Project[] = [
  {
    slug: 'hug',
    title: 'HUG',
    summary: 'Une plateforme web pour les HUG et le Centre de transfusion sanguine de Genève.',
    cover: hugCover,
    color: '#39803C',
    skills: ['Marketing', 'Développement full-stack', 'Product Owner'],
    members: ['Léa Häberli'],
    images: [
      { src: hugCover, alt: 'Maquette de la plateforme HUG', theme: 'light' },
      { src: hugCover, alt: 'Détail de la plateforme HUG', theme: 'light' },
    ],
    texts: [
      { heading: 'Contexte', paragraphs: ['Texte à remplacer.'] },
      { heading: 'Mon rôle', paragraphs: ['Texte à remplacer.'] },
      { heading: 'La solution', paragraphs: ['Texte à remplacer.'] },
      { heading: 'Résultat', paragraphs: ['Texte à remplacer.'] },
    ],
  },
  {
    slug: 'etoile-blanche',
    title: 'Etoile Blanche',
    summary: "Renforcement de l'image de l'Étoile Blanche, restaurant et bar dansant au cœur de Lausanne.",
    cover: etoileCover,
    color: '#FFA0A0',
    skills: ['Marketing', 'Communication'],
    members: ['Léa Häberli' ],
    images: [
      { src: etoileCover, alt: 'Etoile Blanche' },
      { src: etoileCover, alt: 'Etoile Blanche' },
    ],
    texts: [todo, todo, todo, todo],
  },
  {
    slug: 'noraa',
    title: 'Noraa',
    summary: 'Texte de présentation à compléter.',
    cover: noraaCover,
    color: '#70BBE6',
    skills: ['Design UX', 'Design UI'],
    members: ['Léa Häberli'],
    images: [
      { src: noraaCover, alt: 'Noraa' },
      { src: noraaCover, alt: 'Noraa' },
    ],
    texts: [todo, todo, todo, todo],
  },
  {
    slug: 'visualisation-donnees',
    title: 'Visualisation des données',
    summary: 'Texte de présentation à compléter.',
    cover: visuCover,
    color: '#94E998',
    skills: ['Développement full-stack'],
    members: ['Léa Häberli'],
    images: [
      { src: visuCover, alt: 'Visualisation des données' },
      { src: visuCover, alt: 'Visualisation des données' },
    ],
    texts: [todo, todo, todo, todo],
  },
  {
    slug: 'e-commerce',
    title: 'E-commerce',
    summary: "Conception et mise en ligne d'une boutique fictive de bijoux en céramique faits main.",
    cover: modterraCover,
    color: '#F2A900',
    skills: ['Marketing', 'Communication'],
    members: ['Léa Häberli'],
    images: [
      { src: modterraCover, alt: 'Boutique en ligne' },
      { src: modterraCover, alt: 'Boutique en ligne' },
    ],
    texts: [todo, todo, todo, todo],
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

// Le dernier projet renvoie au premier
export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}