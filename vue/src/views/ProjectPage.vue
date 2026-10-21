<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { useHorizontalScroll } from "../composables/useHorizontalScroll";
import { getProject, getNextProject } from "../data/projects";
import type { ProjectImage, TextBlock } from "../data/projects";
import { gsap } from "gsap";
import { formatText } from "../utils/formatText";
import { getLinkKind } from "../utils/linkType";
import type { ProjectLink } from "../data/projects";

type Block =
  | { kind: "image"; image: ProjectImage }
  | { kind: "text"; heading: string; text: TextBlock };

const route = useRoute();
const router = useRouter();
const NEXT_SHIFT = 0.12;

const containerRef = ref<HTMLElement | null>(null);
const { reset } = useHorizontalScroll(containerRef, {
  onUpdate: ({ x, duration }) => {
    const track = containerRef.value;
    const section = track?.querySelector<HTMLElement>(".pp-next");
    const word = section?.querySelector<HTMLElement>(".pp-next-word");
    if (!track || !section || !word) return;

    // Position de la section dans le ruban (indépendante du défilement)
    const sectionLeft =
      section.getBoundingClientRect().left - track.getBoundingClientRect().left;
    const leftOnScreen = sectionLeft + x;

    // 0 quand la section apparaît à droite de l'écran, 1 quand elle est entièrement en place
    const q = gsap.utils.clamp(
      0,
      1,
      (window.innerWidth - leftOnScreen) / window.innerWidth,
    );

    gsap.to(word, {
      x: -q * window.innerWidth * NEXT_SHIFT,
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  },
  onReset: () => {
    const word =
      containerRef.value?.querySelector<HTMLElement>(".pp-next-word");
    if (word) gsap.set(word, { clearProps: "transform" });
  },
});

const project = computed(() => getProject(String(route.params.slug)));
const nextProject = computed(() =>
  project.value ? getNextProject(project.value.slug) : undefined,
);

// Un bloc sans contenu est considéré comme absent
const hasContent = (t?: TextBlock): t is TextBlock =>
  !!t && !!(t.paragraphs?.length || t.bullets?.length || t.links?.length);

// L'ordre du ruban : image, Description, Approche, [Mon rôle], image, Fonctionnalités, Défis
const blocks = computed<Block[]>(() => {
  const p = project.value;
  if (!p) return [];
  const [img1, img2] = p.images;

  const list: Block[] = [
    { kind: "image", image: img1 },
    { kind: "text", heading: "Description", text: p.description },
    { kind: "text", heading: "Approche", text: p.approach },
  ];

  // « Mon rôle » est facultatif
  if (hasContent(p.role)) {
    list.push({ kind: "text", heading: "Mon rôle", text: p.role });
  }

  list.push(
    { kind: "image", image: img2 },
    { kind: "text", heading: "Fonctionnalités", text: p.features },
    { kind: "text", heading: "Défis et apprentissage", text: p.challenges },
  );

  return list;
});

// Le menu ramène à l'accueil, sur la section demandée
const goHome = (id: string) => {
  router.push({ path: "/", hash: id ? `#${id}` : "" });
};

const logoGroup = computed(() => {
  const logos = project.value?.logos ?? [];
  if (!logos.length) return [];
  const repeats = Math.ceil(8 / logos.length);
  return Array.from({ length: repeats }, () => logos).flat();
});

const kindOf = (link: ProjectLink) => link.type ?? getLinkKind(link.href);

// Un autre projet : on repart du début du ruban
watch(
  () => route.params.slug,
  () => reset(),
);

watchEffect(() => {
  if (project.value) document.title = `${project.value.title} — Léa Häberli`;
});
</script>

<template>
  <main
    v-if="project"
    class="project-page"
    :style="{ '--accent': project.color }"
  >
    <Navbar @navigate="goHome" />

    <div ref="containerRef" class="pp-track">
      <!-- 1. Titre, compétences, membres -->
      <header class="pp-intro">
        <div class="pp-intro-inner">
          <h1 class="pp-title">{{ project.title }}</h1>
          <p class="pp-skills">{{ project.skills.join(" / ") }}</p>
          
          <div
            v-if="logoGroup.length"
            class="pp-logos"
            :style="{ '--count': logoGroup.length }"
            aria-label="Outils et technologies du projet"
          >
            <div class="pp-logos-track">
              <ul class="pp-logos-list">
                <li v-for="(logo, i) in logoGroup" :key="i">
                  <img
                    :src="logo.src"
                    :alt="logo.name"
                    loading="lazy"
                    decoding="async"
                  />
                  <span class="logo-name">{{ logo.name }}</span>
                </li>
              </ul>

              <!-- Copie identique, nécessaire à la boucle : ignorée par les lecteurs d'écran -->
              <ul class="pp-logos-list" aria-hidden="true">
                <li v-for="(logo, i) in logoGroup" :key="'copy-' + i">
                  <img :src="logo.src" alt="" loading="lazy" decoding="async" />
                  <span class="logo-name">{{ logo.name }}</span>
                </li>
              </ul>
            </div>
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
          <img
            :src="block.image.src"
            :alt="block.image.alt"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <section v-else class="pp-text">
          <h2 class="pp-text-heading">{{ block.heading }}</h2>

          <div v-if="block.text.paragraphs?.length" class="pp-text-body">
            <p
              v-for="(paragraph, j) in block.text.paragraphs"
              :key="j"
              v-html="formatText(paragraph)"
            ></p>
          </div>

          <ul v-if="block.text.bullets?.length" class="pp-bullets">
            <li
              v-for="(bullet, j) in block.text.bullets"
              :key="j"
              v-html="formatText(bullet)"
            ></li>
          </ul>

          <ul v-if="block.text.links?.length" class="pp-links">
            <li v-for="link in block.text.links" :key="link.label">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <template v-if="kindOf(link) === 'image'">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="1.5" />
                    <path d="M21 16l-5-5-9 9" />
                  </template>
                  <template v-else-if="kindOf(link) === 'pdf'">
                    <path
                      d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
                    />
                    <path d="M14 3v5h5" />
                  </template>
                  <template v-else>
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </template>
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
  font-size: clamp(5rem, min(11vw, 22vh), 5rem);
  line-height: 0.9;
}

.pp-skills {
  margin-top: 1rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
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
  font-size: clamp(2.625rem, 2.6vw, 2.8rem);
  line-height: 1.1;
}

.pp-text-body,
.pp-bullets {
  font-family: var(--font-project-body);
  font-size: clamp(1rem, 1.25vw, 1.125rem);
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
  pointer-events: none; /* le bloc entier n'est plus sensible au survol ni au clic */
}

.pp-next-title {
  font-family: var(--font-chapter);
  font-size: clamp(4rem, min(11vw, 22vh), 10rem);
  line-height: 0.95;
  transition: color 0.3s ease;
}

.pp-next-title span {
  display: block;
  width: fit-content; /* la zone sensible suit la largeur du mot, pas celle du bloc */
  margin: 0 auto;
  pointer-events: auto; /* seuls les textes réagissent */
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

/* --- Carrousel de logos --- */
.pp-logos {
  --logo-h: 4rem; /* hauteur des logos */
  --logo-gap: 1.5rem; /* espace entre deux logos */

  margin-top: 2.5rem;
  width: min(100%, 34rem);
  overflow: hidden;
  /* fondu sur les bords gauche et droit */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 12%,
    #000 88%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 12%,
    #000 88%,
    transparent
  );
}

.pp-logos-track {
  display: flex;
  width: max-content;
  animation: pp-marquee linear infinite;
  animation-duration: calc(
    var(--count) * 2.5s
  ); /* vitesse constante, quel que soit le nombre */
}

.pp-logos:hover .pp-logos-track {
  animation-play-state: paused; /* la bande s'arrête au survol */
}

.pp-logos-list {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--logo-gap);
  padding-right: var(
    --logo-gap
  ); /* même écart entre la fin de la liste et sa copie */
  list-style: none;
}

.pp-logos-list img {
  display: block;
  height: var(--logo-h);
  width: auto;
  max-width: none;
  transition:
    filter 0.3s ease,
    opacity 0.3s ease;
}

.pp-logos-list .logo-name {
  opacity: 0;
}

@keyframes pp-marquee {
  to {
    transform: translateX(
      -50%
    ); /* la moitié de la bande = une liste complète : la boucle est invisible */
  }
}

/* Moins d'animations : plus de défilement, on peut faire glisser la bande à la main */
@media (prefers-reduced-motion: reduce) {
  .pp-logos-track {
    animation: none;
  }

  .pp-logos {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
  }
}

/* Couleur de base du texte */
.pp-text-body,
.pp-bullets {
  color: #111111;
}

/* Passages en gras */
.pp-text :deep(strong) {
  font-family: var(--font-logo); /* Poppins Semibold : un vrai gras */
  font-weight: normal;
}

/* Passages colorés */
.pp-text :deep(.c-vert) {
  color: var(--c-vert);
}
.pp-text :deep(.c-rose) {
  color: var(--c-rose);
}
.pp-text :deep(.c-bleu) {
  color: var(--c-bleu);
}
.pp-text :deep(.c-jaune) {
  color: var(--c-jaune);
}

.project-page {
  /* Versions assez foncées de ta palette pour rester lisibles sur du blanc */
  --c-vert: #39803c;
  --c-rose: #ffa0a0;
  --c-bleu: #70bbe6;

  color: #111111;
  background: #ffffff;
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
    --intro-pad: 20vw; /* décalage du titre depuis la gauche */
    --image-w: 42vw; /* largeur des images */
    --text-w: 40vw; /* largeur des zones de texte */
    --gap: 8vw; /* espace entre deux éléments du ruban */

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
    padding-top: 18vh; /* le titre de chaque zone est à environ un quart de la hauteur */
  }

  .pp-next {
    width: 100vw;
    margin-left: calc(var(--gap) * 0.2);
  }
}
</style>
