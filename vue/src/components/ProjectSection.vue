<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    line1?: string; // 1re ligne du titre
    line2?: string; // 2e ligne du titre
    image: string;
    imageAlt?: string;
    skill: string;
    title: string;
    text: string;
    button: string;
    number?: number | string; // numéro du projet
    numberColor?: string;
    to?: string;
  }>(),
  {
    imageAlt: "",
  },
);

const REPEAT = 10; // nombre de fois où le numéro est écrit dans la colonne

// Une section sans titre est une "suite" : on la rapproche de la précédente
const hasTitle = computed(() => !!(props.line1 || props.line2));
</script>

<template>
  <section
    class="title-section"
    :class="{ 'is-followup': !hasTitle }"
    :style="numberColor ? { '--num-color': numberColor } : undefined"
  >
    <div
      v-if="number !== undefined"
      class="title-section-numbers"
      aria-hidden="true"
    >
      <div class="title-section-numbers-track">
        <span v-for="n in REPEAT" :key="n" class="title-section-number">{{
          number
        }}</span>
      </div>
    </div>

    <img
      class="title-section-image"
      :src="image"
      :alt="imageAlt"
      loading="lazy"
      decoding="async"
    />

    <h2 v-if="hasTitle" class="title-section-title">
      <span class="title-section-line-1">{{ line1 }}</span>
      <span>{{ line2 }}</span>
    </h2>

    <RouterLink v-if="to" :to="to" class="title-section-button">
      <div class="title-section-block">
        <p class="title-section-skill">{{ skill }}</p>
        <p class="title-section-project">{{ title }}</p>
        <p class="title-section-text">{{ text }}</p>

        <span class="title-section-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </span>

        <!-- Texte invisible, lu par les lecteurs d'écran -->
        <span class="sr-only">{{ button }}</span>
      </div>
    </RouterLink>
  </section>
</template>
<style scoped>
/* ===================== COMMUN (desktop et mobile) ===================== */
.title-section {
  --num-gap: 1.5vw; /* espace entre la colonne de numéros et l'image */
  --num-size: clamp(8rem, 26vh, 18rem); /* taille des numéros */
  --block-w: min(30vw, 28rem); /* largeur du bloc */
  --margin-r: -9vw; /* négatif : le bloc dépasse du bord droit de l'écran */
  --overlap: 5vw; /* de combien le bloc passe sur l'image */
  --followup-pull: 25vw; /* de combien les sections suivantes sont rapprochées */
  --lead-space: 12vw;
  --image-w: 40rem;
  --num-color: #111111; /* remplacée par la prop numberColor */
  --num-opacity: 0.5;
  --image-offset: calc(var(--margin-r) + var(--block-w) - var(--overlap));

  position: relative;
  flex: 0 0 auto;
}

.title-section-image {
  object-fit: cover;
  z-index: 0;
}

.title-section-title {
  font-family: var(--font-chapter);
  font-weight: normal;
  line-height: 0.95;
  color: #111111;
}

.title-section-title span {
  display: block; /* une ligne par span */
}

.title-section-skill {
  font-family: var(--font-project-skill);
  font-size: 0.9rem;
}

.title-section-project {
  font-family: var(--font-title);
}

.title-section-button {
  text-decoration: none;
  color: inherit;
  font-family: var(--font-project-body);
}

.title-section-block {
  padding: 2rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.title-section-text {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.6;
  color: #111111;
  margin-bottom: 1.5rem;
}

/* Icône de lien */
.title-section-icon {
  display: grid;
  place-items: center;
  align-self: flex-start;
  width: 2.75rem;
  height: 2.75rem;
  margin-top: 0.5rem;
  border: 1px solid currentColor;
  color: #111111;
  transition:
    background 0.25s ease,
    color 0.25s ease;
}

.title-section-icon svg {
  width: 1.2rem;
  height: 1.2rem;
  transition: transform 0.25s ease;
}

.title-section-button:hover .title-section-icon {
  background: #111111;
  color: #ffffff;
}

.title-section-button:hover .title-section-icon svg {
  transform: translate(2px, -2px);
}

.title-section-button:focus-visible .title-section-icon {
  outline: 2px solid #111111;
  outline-offset: 3px;
}

/* Texte réservé aux lecteurs d'écran */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Numéros (affichés seulement sur desktop) */
.title-section-numbers-track {
  will-change: transform;
}

.title-section-number {
  display: block;
  text-align: center;
  font-family: var(--font-title);
  font-size: var(--num-size);
  line-height: 1.2;
  color: var(--num-color);
  user-select: none;
}

/* ============================ DESKTOP ============================ */
@media (min-width: 1024px) {
  .title-section {
    width: 100vw;
    height: 100vh;
  }

  /* Première section projet (celle qui a un titre) */
  .title-section:not(.is-followup) {
    margin-left: var(--lead-space);
  }

  /* Sections suivantes */
  .title-section.is-followup {
    width: calc(100vw - var(--followup-pull));
  }

  .title-section-image {
    position: absolute;
    top: 0;
    right: var(--image-offset);
    width: var(--image-w);
    height: 100%;
  }

  .title-section-title {
    position: absolute;
    top: 50%;
    left: 1vw;
    transform: translateY(-50%); /* centre le titre sur la ligne médiane */
    z-index: 1;
    font-size: 10rem;
    text-align: center;
  }

  .title-section-project {
    font-size: 2.5rem;
    margin-top: 1.5rem;
  }

  .title-section-button {
    display: inline-block;
    margin-top: 0.5rem;
  }

  .title-section-block {
    position: absolute;
    top: 50%;
    right: var(--margin-r);
    translate: 0 -50%; /* centre le bloc sur la ligne médiane */
    z-index: 2;
    width: var(--block-w);
  }

  /* Colonne de numéros, à gauche de l'image */
  .title-section-numbers {
    position: absolute;
    top: 0;
    bottom: 0;
    right: calc(var(--image-offset) + var(--image-w) + var(--num-gap));
    width: max-content;
    padding: 0 1vw;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent,
      #000 15%,
      #000 85%,
      transparent
    );
    mask-image: linear-gradient(
      to bottom,
      transparent,
      #000 15%,
      #000 85%,
      transparent
    );
    opacity: var(--num-opacity);
  }
}

/* ============================= MOBILE ============================= */
@media (max-width: 1023px) {
  .title-section {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 3rem 5vw;
  }

  /* Première section projet : le titre remonte */
  .title-section:not(.is-followup) {
    padding-top: 2rem;
    scroll-margin-top: 4rem;
  }

  .title-section-numbers {
    display: none;
  }

  .title-section-title {
    margin-bottom: 4rem;
    font-size: clamp(3.5rem, 18vw, 6rem);
    text-align: left;
  }

  .title-section-image {
    position: relative;
    order: 2; /* l'image passe sous le titre */
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3; /* la hauteur suit la largeur de l'écran */
    background: #ececec;
  }

  .title-section-button {
    position: relative;
    z-index: 1; /* la carte passe devant l'image */
    display: block;
    order: 3;
    align-self: flex-end;
    width: 100%;
  }

  .title-section-block {
    box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.12);
    translate: none;
  }

  .title-section-skill {
    line-height: 1.5rem;
  }

  .title-section-project {
    margin-top: 1.5rem;
    margin-bottom: -0.5rem;
    font-size: 2rem;
    line-height: 2rem;
  }
}
</style>