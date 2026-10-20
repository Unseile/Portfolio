<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { useHorizontalScroll } from '../composables/useHorizontalScroll'
import { getProject, getNextProject } from '../data/projects'
import type { ProjectImage, TextBlock } from '../data/projects'
import { gsap } from 'gsap'

type Block =
  | { kind: 'image'; image: ProjectImage }
  | { kind: 'text'; text: TextBlock }

const route = useRoute()
const router = useRouter()
const NEXT_SHIFT = 0.12

const containerRef = ref<HTMLElement | null>(null)
const { reset } = useHorizontalScroll(containerRef, {
  onUpdate: ({ x, duration }) => {
    const track = containerRef.value
    const section = track?.querySelector<HTMLElement>('.pp-next')
    const word = section?.querySelector<HTMLElement>('.pp-next-word')
    if (!track || !section || !word) return

    // Position de la section dans le ruban (indépendante du défilement)
    const sectionLeft =
      section.getBoundingClientRect().left - track.getBoundingClientRect().left
    const leftOnScreen = sectionLeft + x

    // 0 quand la section apparaît à droite de l'écran, 1 quand elle est entièrement en place
    const q = gsap.utils.clamp(0, 1, (window.innerWidth - leftOnScreen) / window.innerWidth)

    gsap.to(word, {
      x: -q * window.innerWidth * NEXT_SHIFT,
      duration,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  },
  onReset: () => {
    const word = containerRef.value?.querySelector<HTMLElement>('.pp-next-word')
    if (word) gsap.set(word, { clearProps: 'transform' })
  },
})

const project = computed(() => getProject(String(route.params.slug)))
const nextProject = computed(() =>
  project.value ? getNextProject(project.value.slug) : undefined,
)

// L'ordre du ruban : image, 2 textes, image, 2 textes
const blocks = computed<Block[]>(() => {
  const p = project.value
  if (!p) return []
  const [img1, img2] = p.images
  const [t1, t2, t3, t4] = p.texts
  return [
    { kind: 'image', image: img1 },
    { kind: 'text', text: t1 },
    { kind: 'text', text: t2 },
    { kind: 'image', image: img2 },
    { kind: 'text', text: t3 },
    { kind: 'text', text: t4 },
  ]
})

// Le menu ramène à l'accueil, sur la section demandée
const goHome = (id: string) => {
  router.push({ path: '/', hash: id ? `#${id}` : '' })
}

// Un autre projet : on repart du début du ruban
watch(() => route.params.slug, () => reset())

watchEffect(() => {
  if (project.value) document.title = `${project.value.title} — Léa Häberli`
})
</script>

<template>
  <main v-if="project" class="project-page" :style="{ '--accent': project.color }">
    <Navbar @navigate="goHome" />

    <div ref="containerRef" class="pp-track">
      <!-- 1. Titre, compétences, membres -->
      <header class="pp-intro">
        <div class="pp-intro-inner">
          <h1 class="pp-title">{{ project.title }}</h1>
          <p class="pp-skills">{{ project.skills.join(' / ') }}</p>

          <div class="pp-members">
            <h2 class="pp-members-label">Membres du projet :</h2>
            <ul class="pp-members-list">
              <li v-for="(member, i) in project.members" :key="i">{{ member }}</li>
            </ul>
          </div>
        </div>
      </header>

      <!-- 2 à 7. Images pleine hauteur et zones de texte -->
      <template v-for="(block, i) in blocks" :key="i">
        <figure
          v-if="block.kind === 'image'"
          class="pp-image"
          :data-nav-theme="block.image.theme ?? 'light'"
        >
          <img :src="block.image.src" :alt="block.image.alt" loading="lazy" decoding="async" />
        </figure>

        <section v-else class="pp-text">
          <h2 v-if="block.text.heading" class="pp-text-heading">{{ block.text.heading }}</h2>

          <div v-if="block.text.paragraphs?.length" class="pp-text-body">
            <p v-for="(paragraph, j) in block.text.paragraphs" :key="j">{{ paragraph }}</p>
          </div>

          <ul v-if="block.text.bullets?.length" class="pp-bullets">
            <li v-for="(bullet, j) in block.text.bullets" :key="j">{{ bullet }}</li>
          </ul>

          <ul v-if="block.text.links?.length" class="pp-links">
            <li v-for="link in block.text.links" :key="link.label">
              <a :href="link.href" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5" />
                </svg>
                <span>{{ link.label }}</span>
              </a>
            </li>
          </ul>
        </section>
      </template>

      <!-- 8. Prochain projet -->
      <RouterLink
        v-if="nextProject"
        class="pp-next"
        :to="`/projets/${nextProject.slug}`"
        :style="{ '--accent': nextProject.color }"
      >
        <span class="pp-next-title">
          <span class="pp-next-word">Prochain</span>
          <span>Projet</span>
        </span>
        <span class="pp-next-caption">{{ nextProject.title }} →</span>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.project-page {
  --accent: #39803c;
  color: #111111;
  background: #ffffff;
}

/* --- Introduction --- */
.pp-title {
  font-family: var(--font-chapter);
  font-weight: normal;
  font-size: clamp(5rem, min(11vw, 22vh), 10rem);
  line-height: 0.9;
}

.pp-skills {
  margin-top: 1rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
}

.pp-members {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-top: 2.5rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.6;
}

.pp-members-label {
  font-weight: normal;
  font-size: inherit;
  color: #666666;
  white-space: nowrap;
}

.pp-members-list {
  list-style: none;
  color: #444444;
}

/* --- Images --- */
.pp-image {
  margin: 0;
  overflow: hidden;
}

.pp-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- Zones de texte --- */
.pp-text-heading {
  margin-bottom: 1.5rem;
  font-family: var(--font-title);
  font-weight: normal;
  font-size: clamp(2rem, 2.6vw, 2.8rem);
  line-height: 1.1;
}

.pp-text-body,
.pp-bullets {
  font-family: var(--font-project-body);
  font-size: clamp(1rem, 1.25vw, 1.2rem);
  line-height: 1.65;
}

.pp-text-body p + p {
  margin-top: 1.25rem;
}

.pp-bullets {
  list-style: disc outside;
  padding-left: 1.2em;
}

.pp-bullets li + li {
  margin-top: 0.6rem;
}

.pp-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 1.75rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
}

.pp-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: inherit;
  text-decoration: none;
}

.pp-links a span {
  text-decoration: underline;
  text-underline-offset: 0.3em;
  text-decoration-thickness: 1px;
}

.pp-links a:hover span {
  text-decoration-thickness: 2px;
}

.pp-links svg {
  width: 1.1em;
  height: 1.1em;
  flex: 0 0 auto;
}

/* --- Prochain projet --- */
.pp-next {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
  pointer-events: none;            /* le bloc entier n'est plus sensible au survol ni au clic */
}

.pp-next-title {
  font-family: var(--font-chapter);
  font-size: clamp(4rem, min(11vw, 22vh), 10rem);
  line-height: 0.95;
  transition: color 0.3s ease;
}

.pp-next-title span {
  display: block;
  width: fit-content;              /* la zone sensible suit la largeur du mot, pas celle du bloc */
  margin: 0 auto;
  pointer-events: auto;            /* seuls les textes réagissent */
}

.pp-next-caption {
  font-family: var(--font-body);
  font-size: 1rem;
  color: #555555;
  transition: transform 0.3s ease;
  pointer-events: auto;
}

.pp-next:hover .pp-next-title,
.pp-next:focus-visible .pp-next-title {
  color: var(--accent);
}

.pp-next:hover .pp-next-caption {
  transform: translateX(0.75rem);
}

/* Au clavier, le lien reste visible */
.pp-next:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1rem;
}

/* --- MOBILE : scroll vertical naturel --- */
@media (max-width: 1023px) {
  .pp-track {
    display: flex;
    flex-direction: column;
  }

  .pp-intro {
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    align-items: center;
    padding: 6rem 6vw 3rem;
  }

  .pp-members {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pp-image {
    height: 60vh;
    height: 60svh;
  }

  .pp-text {
    padding: 3.5rem 6vw;
  }

  .pp-next {
    min-height: 70vh;
    min-height: 70svh;
    padding: 4rem 6vw;
  }
}

/* --- DESKTOP : ruban horizontal --- */
@media (min-width: 1024px) {
  .project-page {
    --intro-pad: 27vw;   /* décalage du titre depuis la gauche */
    --image-w: 42vw;     /* largeur des images */
    --text-w: 40vw;      /* largeur des zones de texte */
    --gap: 8vw;          /* espace entre deux éléments du ruban */

    height: 100vh;
    overflow: hidden;
  }

  .pp-track {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: max-content;
    height: 100vh;
  }

  .pp-track > * {
    flex: 0 0 auto;
  }

  /* Espace entre chaque élément, sauf entre l'introduction et la première image */
  .pp-track > * + * {
    margin-left: var(--gap);
  }

  .pp-intro + .pp-image {
    margin-left: 0;
  }

  .pp-intro {
    display: flex;
    align-items: center;
    width: 85vw;
    padding-left: var(--intro-pad);
  }

  .pp-image {
    width: var(--image-w);
    height: 100vh;
  }

  .pp-text {
    width: var(--text-w);
    padding-top: 26vh;     /* le titre de chaque zone est à environ un quart de la hauteur */
  }

  .pp-next {
    width: 100vw;
    margin-left: calc(var(--gap) * 1.5);
  }
}
</style>