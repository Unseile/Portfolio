import hugCover from '../assets/image/mockup_hug.png'
import hugCover2 from '../assets/image/mockup_mobile.png'
import etoileCover from '../assets/image/etoile_blanche.png'
import etoileCover2 from '../assets/image/etoile_mockup2.png'
import noraaCover from '../assets/image/noraa_mockup1.png'
import noraaCover2 from '../assets/image/noraa_mockup2.png'
import visuCover from '../assets/image/visu_mockup1.png'
import visuCover2 from '../assets/image/visu_mockup2.png'
import modterraCover from '../assets/image/modterra_mockup1.png'
import modterraCover2 from '../assets/image/modterra_mockup2.png'

import affinity from '../assets/logo/affinity.png'
import canva from '../assets/logo/canva_logo.png'
import css from '../assets/logo/css_logo.png'
import d3 from '../assets/logo/d3_logo.png'
import figma from '../assets/logo/figma_logo.png'
import gsap from '../assets/logo/gsap_logo.jpeg'
import html from '../assets/logo/html_logo.webp'
import javascript from '../assets/logo/javascript_logo.png'
import laravel from '../assets/logo/laravel_logo.png'
import mysql from '../assets/logo/mysql_logo.png'
import node from '../assets/logo/node_logo.png'
import notion from '../assets/logo/notion_logo.png'
import typescript from '../assets/logo/typescript_logo.png'
import vue3 from '../assets/logo/vue3_logo.png'
import wordpress from '../assets/logo/wordpress_logo.png'
import davinci from '../assets/logo/davinci_logo.png'

import kanban from '../assets/files/Kanban.png'
import user_stories from '../assets/files/User_stories.png'
import hug_rapport from '../assets/files/HUG_rapport.pdf'
import uml from '../assets/files/uml.png'
import noraa_persona from '../assets/files/persona.png'
import noraa_userflow from '../assets/files/userflow.png'
import noraa_design_system from '../assets/files/design_system.png'
import noraa_video from '../assets/files/test.mp4'
import modterra_rapport from '../assets/files/Rapport_e-commerce.pdf'
import modterra_wireframes from '../assets/files/wireframes.png'

export interface ProjectImage {
  src: string
  alt: string
  theme?: 'light' | 'dark'   // fond de l'image : dark = menu en blanc
}

export interface ProjectLink {
  label: string
  href: string
  type?: 'pdf' | 'image' | 'link'   // sinon détecté d'après l'extension
}

// Un bloc de texte : tu peux combiner paragraphes, puces et liens
export interface TextBlock {
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
  logos?: ProjectLogo[]
  images: [ProjectImage, ProjectImage]

  // Après la 1re image
  description: TextBlock
  approach: TextBlock
  role?: TextBlock            // facultatif : n'apparaît que s'il est renseigné

  // Après la 2e image
  features: TextBlock
  challenges: TextBlock
}

export interface ProjectLogo {
  name: string        // sert de texte alternatif
  src: string
}

export const projects: Project[] = [
  {
    slug: 'hug',
    title: 'HUG',
    summary: 'Une plateforme web pour les HUG et le Centre de transfusion sanguine de Genève.',
    cover: hugCover,
    color: '#39803C',
    skills: ['Marketing', 'Développement full-stack', 'Product Owner'],
    logos: [
      {name: 'Laravel', src: laravel},
      {name: 'HTML', src: html},
      {name: 'CSS', src: css},
      {name: 'Typescript', src: typescript},
      {name: 'Vue.js', src: vue3},
      {name: 'Node.js', src: node},
      {name: 'MySQL', src: mysql},
      {name: 'GSAP', src: gsap},
      {name: 'D3', src: d3},
      {name: 'Affinity', src: affinity},
      {name: 'Figma', src: figma},
      {name: 'Canva', src: canva},
      {name: 'Notion', src: notion},
    ],
    images: [
      { src: hugCover, alt: 'Maquette de la plateforme HUG', theme: 'light' },
      { src: hugCover2, alt: 'Détail de la plateforme HUG', theme: 'light' },
    ],
    description: {
      paragraphs: [`Conception d’**==bleu:une plateforme web==** réalisée pour les HUG et le Centre de transfusion sanguine de Genève. Elle répond à un constat : environ 30 % des personnes qui s’inscrivent à une collecte de sang en entreprise ne sont finalement pas éligibles au don. La plateforme les informe avant le déplacement et valorise les entreprises qui organisent des collectes, grâce à un label et à un prix annuel. Nous avons également conçu **==rose:une plateforme==** d’administration destinée aux responsables des HUG. Elle leur permet de traiter les réponses du formulaire et de créer **==vert:les sites co-brandés==** des entreprises partenaires.`],
      links: [
        { label: 'Rapport', href: hug_rapport },
        { label: 'Site Prix du Coeur', href: 'https://coeur-dhonneur.ch/' },
        { label: 'Site co-brandé', href: 'https://coeur-dhonneur.ch/collecte/migros/c6256adafae9ed9e' }
      ],
    },
    approach: {
      paragraphs: [`Nous avons travaillé en équipe de sept, **==vert:en Scrum==**, avec trois sprints d’une semaine, un stand-up quotidien et un suivi sous **==bleu:Notion==** (Kanban, user stories, burndown chart). Nous avons d’abord étudié ce qui existe ailleurs, puis imaginé une expérience volontairement ludique pour contrer l’effet « questionnaire médical froid » : **==rose:un test d’éligibilité==** en swipe, une messagerie guidée et deux mascottes, Sanguy et Blutly. Techniquement, nous avons effectué des maquettes sous Figma, puis nous avons travaillé avec Laravel, Vue 3, TypeScript, MySQL, Tailwind et DaisyUI. Enfin nous avons déployé le backend et le frontend sur Infomaniak.`],
      links: [
        { label: 'UML', href: uml },
        { label: 'Users stories', href: user_stories },
        { label: 'Kanban', href: kanban },
      ],
    },
    role: {
      paragraphs: [`Au sein de l’équipe, j’ai endossé le rôle de **==rose:Product Owner==**. J’ai structuré le travail de l’équipe sprint après sprint, chaque fonctionnalité était découpée en user stories et estimée, ce qui rendait l’avancement visible dans le burndown chart. J’ai aussi soutenu **==vert:le développement back-end et front-end==**, notamment sur la gestion des formulaires de l’espace d’administration et sur la responsivité des plateformes.`],
    },                                            // ce projet a un bloc « Mon rôle »
    features: {
      bullets: [`Site public : présentation du label Cœur d’Honneur et du Prix du Cœur, liste des gagnants, informations pour organiser une collecte.`,
        `Site co-brandé : **==rose:version aux couleurs de l’entreprise et des HUG==**, avec test d’éligibilité et accès à la prise de rendez-vous.`,
        `**==vert:Test en swipe et messagerie guidée==** : arbres de décision et indicateur de saisie.`,
        `Carte du monde interactive (D3.js) : délais d’attente après un voyage.`,
        `Back-office : gestion des entreprises, des collectes et des gagnants, avec attribution des prix répercutée sur le site public.`,
        `Tableau de bord de KPI : actualisé toutes les 30 secondes, avec collecte d’événements **==bleu:conforme au RGPD==** (aucun suivi sans consentement).`]
    },
    challenges: {
      bullets: [`Un délai court et beaucoup de livrables : **==vert:nous devions prioriser.==**`,
        `Les retours des enseignants et tests utilisateurs : nous ont poussés à repenser le site co-brandé.`,
        `Le périmètre : c’était important de définir ce que la plateforme gère elle-même et ce qui relève du CTS.`,
        `Les limites du projet : le questionnaire doit être validé médicalement avant un usage réel.`
      ],
      paragraphs: [`J’ai appris à porter une vision produit dans une équipe de sept, **==bleu:à arbitrer entre nos envies de concevoir un excellent produit et le délai à respecter.==**`],
    },
  },
  {
    slug: 'etoile-blanche',
    title: 'Etoile Blanche',
    summary: "Renforcement de l'image de l'Étoile Blanche, restaurant et bar dansant au cœur de Lausanne.",
    cover: etoileCover,
    color: '#FFA0A0',
    skills: ['Marketing', 'Communication'],
    logos: [
      {name: 'Figma', src: figma},
      {name: 'Canva', src: canva},
      {name: 'Affinity', src: affinity},
    ],
    images: [
      { src: etoileCover, alt: 'Etoile Blanche' },
      { src: etoileCover2, alt: 'Etoile Blanche' },
    ],
    description: {
      paragraphs: [`**==rose:Playbook de marque==** réalisé pour l’Étoile Blanche, restaurant et bar dansant de Lausanne repris par une nouvelle direction en 2025. Dans le cadre du cours à la HEIG-VD, notre équipe a répondu à un brief réel : **==vert:renforcer l’image de l’établissement et relancer sa partie restauration==**. Le playbook, publié sous forme de site web, pose une identité cohérente et donne à l’équipe des outils concrets pour l’appliquer.`],
      links: [
        { label: 'Playbook', href: 'https://keedjud.github.io/Playbook_EtoileBlanche/' }
      ],
    },
    approach: {
      paragraphs: [`Nous sommes partie de **==bleu:la vision de la marque==** (« créer un lieu de vie où chacun trouve naturellement sa place »), déclinée en trois valeurs : accessibilité, spontanéité, convivialité. Cela nous a permis de débouché sur **==rose:un positionnement clair==** : devenir la référence lausannoise du cordon bleu et de l’afterwork. Chaque livrable (réseaux sociaux, supports imprimés, site web, support libre, guide photo) découle de cette base pour **==vert:garantir l’homogénéité==** exigée par le client.`],
    },
    role: {
      paragraphs: [`La répartition des rôles au sein de l'équipe s'est faite de manière équitable. De mon côté, j'ai principalement pris en charge la **==vert:conception d’un glaçon personnalisé==** à l’image de la marque ainsi qu'aux **==rose:contenus des publications sur les réseaux sociaux==**.`],
    },                                            // ce projet a un bloc « Mon rôle »
    features: {
      bullets: [`Stratégie globale : valeurs, positionnement et visions à court, moyen et long terme.`,
        `**==bleu:Calendrier éditorial==** : les publications par semaine, avec des rendez-vous fixes (cordon bleu le mardi, afterwork le jeudi).`,
        `Recommandations pour le site du restaurant : optimisation mobile, charte, nouvelle page.`,
        `**==rose:Supports physiques==** : cartes du midi et du soir, stand-ups, règles typographiques.`,
        `Glaçon brandé : un concept de branding original, proposé comme support libre.`,
        `Guide photo : bonnes pratiques de photo culinaire avec exemples avant et après.`,
        `Analyse et budget : audience actuelle, objectifs de croissance.`,
        `**==vert:Bibliothèque d’assets==** : logos, typographies et palette.`,]
    },
    challenges: {
      bullets: [`Rester cohérent entre tous les livrables.`,
        `Proposer des idées réalisables : le budget chiffré et le calendrier répondent à l’exigence d’**==vert:une plus-value réelle.==**`,
        `Se mettre à la place d’une agence face à un vrai client : comprendre ses contraintes et son vrai besoin.`
      ],
      paragraphs: [`J’ai appris à construire une identité de marque du fond vers la forme, à rendre **==bleu:une stratégie applicable par une petite équipe==**, et à justifier chaque choix créatif par un objectif.`],
    },
  },
  {
    slug: 'noraa',
    title: 'Noraa',
    summary: `Conception d'une application de suivi de santé.`,
    cover: noraaCover,
    color: '#70BBE6',
    skills: ['Design UX', 'Design UI'],
    logos: [
      {name: 'Figma', src: figma},
      {name: 'Affinity', src: affinity},
      {name: 'Davinci', src: davinci}
    ],
    images: [
      { src: noraaCover, alt: 'Noraa' },
      { src: noraaCover2, alt: 'Noraa' },
    ],
    description: {
      paragraphs: [`Noraa est **==bleu:une application de suivi de santé==** conçue en équipe de trois, pour l’Objectif de développement durable n° 3, « Bonne santé et bien-être ». Elle aide les personnes soucieuses de leur santé à comprendre leur état du jour en croisant ce qu’elles renseignent (symptômes, historique médical) avec leur environnement (météo, pollen, pollution, humidité).
Son parti pris : **==vert:informer sans angoisser==**. Noraa n’affiche aucun score de santé, propose des recommandations contextuelles et invite à consulter un médecin quand l’évolution des indicateurs devient préoccupante.`],
      links: [
        { label: 'Prototype', href: 'https://www.figma.com/proto/YWAT7FpNuWq8noaJYTPWjK/BasesUI---L%C3%A9a-H%C3%A4berli---Etienne-Bergeon---Loann-Juillerat?node-id=295-1664&page-id=295%3A1663&starting-point-node-id=295%3A1664&t=xKOk7leCDNLg4ikQ-1' },
        { label: 'Motion design', href: noraa_video }
      ],
    },
    approach: {
      paragraphs: [`Nous avons suivi le processus de **==rose:design thinking==**, de la recherche à l’interface. La recherche a donné une carte des données possibles et s’est appuyée sur trois applications existantes (Swiss-Meds, Symptomate, Ada). Deux personas aux comportements opposés ont guidé la suite. À partir de leurs **==vert:empathy maps==**, nous avons formulé trois pistes et retenu celle qui croise santé personnelle et facteurs environnementaux. Après brainstorming et comparaison d’idées, nous avons décidé de concevoir un suivi assisté et enfin, conçu l’interface : **==bleu:moodboard, user flow, wireframes, design system et prototype cliquable==** sous Figma.`],
      links: [
        { label: 'Design system', href: noraa_design_system },
        { label: 'Userflow', href: noraa_userflow },
        { label: 'Personas', href: noraa_persona },
      ],
    },
    role: {
      paragraphs: [`Nous avons réparti le travail de manière équitable dans l’équipe, et **==bleu:j’ai participé à toutes les étapes du projet==** : recherche, personas et empathy maps, idéation, conception de l’interface et prototype, jusqu’à la présentation.`],
    },                                            // ce projet a un bloc « Mon rôle »
    features: {
      bullets: [
        `**==vert:Suivi personnalisé==** : l’utilisateur renseigne ses symptômes et son historique médical.`,
        `Croisement avec l’environnement : météo, pollen, pollution et humidité sont intégrés automatiquement.`,
        `Recommandations contextuelles : à tout moment, des conseils adaptés à l’état et au contexte du jour.`,
        `Alerte bienveillante : en cas d’évolution préoccupante, l’application invite à consulter un médecin dans les meilleurs délais.`,
        `**==bleu:Cadre clair : Noraa est un outil de suivi et non de diagnostic.==**`
      ]
    },
    challenges: {
      bullets: [
        `**==rose:Informer sans angoisser==** : la plupart des applications de santé alarment. Nous avons dû trouver un équilibre entre utilité et sérénité, ce qui nous a menés à abandonner l’idée des scores.`,
        `Éviter la saisie fastidieuse : une frustration explicite de nos personas. Elle a pesé dans l’abandon du journal de bord manuel au profit **==bleu:du croisement automatique de données.==**`,
        `Un sujet sensible : la santé impose de la prudence sur la responsabilité et les données, d’où le cadre posé (outil de suivi et non de diagnostic).`
      ],
      paragraphs: [`Partir de deux personas qui sont très différents ont rendu les compromis de conception plus clairs et moins arbitraires.`],
    },
  },
  {
    slug: 'visualisation-donnees',
    title: 'Visualisation de données',
    summary: `Visualisation de données sous forme d'un scrollytelling.`,
    cover: visuCover,
    color: '#94E998',
    skills: ['Développement full-stack'],
    logos: [
      {name: 'HTML', src: html},
      {name: 'CSS', src: css},
      {name: 'Javascript', src: javascript},
      {name: 'Node.js', src: node},
      {name: 'GSAP', src: gsap},
      {name: 'D3', src: d3},
    ],
    images: [
      { src: visuCover, alt: 'Visualisation des données' },
      { src: visuCover2, alt: 'Visualisation des données' },
    ],
    description: {
      paragraphs: [`Projet de **==rose:visualisation de données==** réalisé en binôme. Nous avons choisi la franchise Pokémon et raconté un paradoxe que nous ressentons : une popularité qui explose, face à une progression critique et technique que beaucoup de joueurs jugent trop lente.
Le récit prend la forme d’un **==vert:scrollytelling==**, qui guide l’utilisateur à travers les générations de Pokémon. Notre objectif était de montrer le « ressenti » du joueur, avec un regard critique mais nuancé. La finalité est que l’évolution est réelle, mais son rythme interroge.`],
    },
    approach: {
      paragraphs: [`Nous avons adopté une approche à la fois explicative (une histoire guidée) et explorative (le visiteur peut fouiller les données). La première chose a été d’effectuer un **==vert:storyboard==** de notre scrollytelling.
Côté données, nous avons croisé des sources hétérogènes : ventes (VGChartz), données de jeu (PokéAPI, Serebii, Bulbapedia), notes de la presse (Metacritic), durées de vie (HowLongToBeat) et statistiques sectorielles (Statista). Nous les avons regroupées dans un **==bleu:jeu de données JSON==** organisé par groupe de versions, avec plus d’une dizaine d’attributs.
Nous avons aussi **==rose:documenté les biais==**, tel que l’inflation qui n’est pas prise en compte dans les prix et les budgets de développement de Game Freak ne sont pas publics.`],
    },                                          // ce projet a un bloc « Mon rôle »
    features: {
      bullets: [
        `Scrollytelling : le récit avance au fil du défilement, animé avec **==rose:GSAP==**.`,
        `Visualisations **==bleu:d3==** : ventes, notes critiques et utilisateurs, durée de vie, nouveautés par génération.`
      ]
    },
    challenges: {
      bullets: [
        `**==vert:Rassembler et nettoyer des données==** issues de sources très différentes.`,
        `Rester objectif sur un sujet qui nous touche directement, il faut **==bleu:démontrer plutôt que critiquer==**.`,
        `Comprendre les différentes librairies de GSAP et d3.`
      ],
      paragraphs: [`J’ai appris à construire un récit à partir de données, à choisir une visualisation pour son message plutôt que pour son effet, et à expliciter les limites d’un jeu de données.`],
    },
  },
  {
    slug: 'e-commerce',
    title: 'E-commerce',
    summary: "Conception et mise en ligne d'une boutique fictive de bijoux en céramique faits main.",
    cover: modterraCover,
    color: '#FFA0A0',
    skills: ['Marketing', 'Communication'],
    logos: [
      {name: 'Figma', src: figma},
      {name: 'Wordpress', src: wordpress},
    ],
    images: [
      { src: modterraCover, alt: 'Boutique en ligne' },
      { src: modterraCover2, alt: 'Boutique en ligne' },
    ],
    description: {
      paragraphs: [`Modterra est **==bleu:une boutique fictive en ligne de bijoux en céramique faits main==**, conçue et mise en ligne seule dans le cadre du cours **==rose:e-commerce==**. Son nom relie la terre, matière première de la poterie, et l’univers de la mode. Le projet couvre toute la chaîne : stratégie, identité, développement du site, référencement, marketing et mesure de performance.`],
      links: [
        { label: 'Rapport', href: modterra_rapport }
      ],
    },
    approach: {
      paragraphs: [`Je suis partie en effectuant une **==vert:analyse concurrentielle==** ainsi que définir mon public cible via deux personas. L’assortiment s’organise en trois niveaux (bijoux, décoration, print-on-demand). J’ai ensuite défini une identité en trois couleurs évoquant la terre, établit des wireframes pour quatre pages, puis construit la boutique avec **==bleu:WordPress, WooCommerce, Blocksy et Elementor==**, hébergée chez Infomaniak.`],
      links: [
        { label: 'Wireframes', href: modterra_wireframes }
      ],
    },                                          // ce projet a un bloc « Mon rôle »
    features: {
      bullets: [
        `Boutique WooCommerce : fiches produit avec variantes, **==rose:descriptions structurées et données SEO complètes==**.`,
        `Produits affiliés et print-on-demand : intégration de produits Amazon et Printful.`,
        `Paiements : carte, PayPal et TWINT.`,
        `Conformité : bandeau de consentement Axeptio **==vert:relié à Google Tag Manager==**, pour que Google Analytics ne collecte rien sans accord selon le **==bleu:RGPD==**.`,
        `Newsletter : Mailchimp avec pop-up de bienvenue à 10 % de réduction.`,
        `Marketing : calendrier éditorial sur Instagram, Facebook et Pinterest.`]
    },
    challenges: {
      bullets: [
        `Indexation Google : le sitemap n’était pas récupéré, et c’est **==vert:la purge du cache==** qui a débloqué la situation.`,
        `Les limites assumées : score mobile à améliorer, filtres de produits absents, gestion des stocks trop basique.`
      ],
      paragraphs: [`J’ai appris à relier choix techniques, contraintes réglementaires (RGPD) et objectifs commerciaux, ainsi que **==rose:diagnostiquer des blocages techniques concrets==** afin de concevoir une boutique en ligne complète.`],
    },
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

// Le dernier projet renvoie au premier
export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}