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
    number?: number | string;   // numéro du projet
    numberColor?: string;
  }>(),
  {
    imageAlt: "",
  },
);

const REPEAT = 10;   // nombre de fois où le numéro est écrit dans la colonne

// Une section sans titre est une "suite" : on la rapproche de la précédente
const hasTitle = computed(() => !!(props.line1 || props.line2));
</script>

<template>
  <section class="title-section" :class="{ 'is-followup': !hasTitle }" :style="numberColor ? { '--num-color': numberColor } : undefined">
      <div v-if="number !== undefined" class="title-section-numbers" aria-hidden="true">
        <div class="title-section-numbers-track">
          <span v-for="n in REPEAT" :key="n" class="title-section-number">{{ number }}</span>
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

    <div class="title-section-block">
      <p class="title-section-skill">{{ skill }}</p>
      <p class="title-section-project">{{ title }}</p>
      <p class="title-section-text">{{ text }}</p>
      <button class="title-section-button">{{ button }}</button>
    </div>
  </section>
</template>

<style scoped>
.title-section {
  --num-gap: 4vw;                                /* espace entre la colonne et l'image */
  --num-size: clamp(8rem, 26vh, 18rem);          /* taille des numéros */
  --image-w: 42vw; /* largeur de l'image */
  --block-w: min(30vw, 28rem); /* largeur du bloc */
  --margin-r: -9vw; /* négatif : le bloc dépasse du bord droit de l'écran */
  --overlap: 5vw; /* de combien le bloc passe sur l'image */
  --followup-pull: 25vw; /* de combien les sections suivantes sont rapprochées */
  --lead-space: 12vw;
  --image-w: 40rem;
  --num-color: #111111;      /* couleur par défaut, remplacée par la prop numberColor */
  --num-opacity: 0.5;       /* transparence : c'est de l'arrière-plan */

  /* L'image se place toute seule à partir du bloc */
  --image-offset: calc(var(--margin-r) + var(--block-w) - var(--overlap));

  position: relative;
  flex: 0 0 auto; /* ne se rétrécit pas dans le conteneur flex */
  width: 100vw;
  height: 100vh;
  /* overflow: hidden retiré : le bloc peut sortir de la section */
}

/* Image : toute la hauteur */
.title-section-image {
  position: absolute;
  top: 0;
  right: var(--image-offset);
  width: var(--image-w);
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Titre : à gauche, sur deux lignes */
.title-section-title {
  position: absolute;
  top: 50%; /* était 30vh */
  left: 1vw;
  transform: translateY(-50%); /* centre le titre sur la ligne médiane */
  z-index: 1;
  font-family: var(--font-chapter);
  font-weight: normal;
  font-size: 10rem; /* se réduit sur les écrans peu hauts ou étroits */
  line-height: 0.95;
  color: #111111;
  text-align: center;
}

.title-section-skill {
  font-family: var(--font-project-skill);
  font-size: 0.8rem;
}

.title-section-project {
  font-family: var(--font-title);
  font-size: 2rem;
}

.title-section-button {
  font-family: var(--font-project-body);
  align-self: flex-start; /* sans ça, le bouton s'étire sur toute la largeur du bloc */
  margin-top: 0.5rem; /* un peu plus d'air avant le bouton */
}

.title-section-title span {
  display: block; /* une ligne par span */
}

/* Bloc : à droite de l'image, il passe un peu dessus */
.title-section-block {
  position: absolute;
  top: 50%; /* remplace bottom: 35vh */
  right: var(--margin-r);
  translate: 0 -50%;          /* remplace transform: translateY(-50%) */
  z-index: 2;
  width: var(--block-w);
  padding: 2.5rem;
  background: #ffffff;

  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.title-section-text {
  font-family: var(--font-project-body);
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.6;
  color: #111111; /* était #ffffff : invisible sur un bloc blanc */
}

.title-section-text + .title-section-text {
  margin-top: 1rem;
}

@media (min-width: 1024px) {
  /* Première section projet (celle qui a un titre) */
  .title-section:not(.is-followup) {
    margin-left: var(--lead-space);
  }

  /* Sections suivantes : déjà en place */
  .title-section.is-followup {
    width: calc(100vw - var(--followup-pull));
  }
}

/* Colonne de numéros, à gauche de l'image */
.title-section-numbers {
  position: absolute;
  top: 0;
  bottom: 0;
  right: calc(var(--image-offset) + var(--image-w) + var(--num-gap));   /* remplace left: 30vw */
  width: max-content;
  padding: 0 1vw;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent);
  opacity: var(--num-opacity);
}

.title-section-numbers-track {
  will-change: transform;
}

.title-section-number {
  display: block;
  text-align: center;
  font-family: var(--font-title);
  font-size: var(--num-size);
  line-height: 1;
  color: var(--num-color);
  user-select: none;
}

/* --- MOBILE : tout s'empile, le bloc chevauche le bas de l'image --- */
@media (max-width: 1023px) {
  .title-section {
    width: 100%;
    height: auto;
    min-height: 0;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    padding: 3rem 5vw;
  }

  /* La première section projet porte le titre : un peu plus de place pour le menu */
  .title-section:not(.is-followup) {
    padding-top: 5rem;
  }

  .title-section-numbers {
    display: none;
  }

  .title-section-title {
    position: static;
    transform: none;
    margin-bottom: 1.5rem;
    font-size: clamp(3.5rem, 18vw, 6rem);
    text-align: center;
  }

  .title-section-image {
    position: static;
    order: 2;                 /* l'image passe sous le titre */
    width: 100%;
    height: 38vh;
    border-radius: 1.5rem;
  }

  .title-section-block {
    position: static;
    order: 3;
    transform: none;
    translate: none;
    align-self: flex-end;
    width: 90%;
    margin-top: -3rem;        /* la carte chevauche le bas de l'image */
    padding: 1.5rem;
    box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.12);
  }
}
</style>
