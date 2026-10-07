<script setup lang="ts">
interface RotatingWord {
  text: string
  color: string
  top: string        // distance depuis le haut de l'écran (ex. '30vh')
  left: string       // distance depuis la gauche de l'écran (ex. '40vw')
  size?: string      // taille de police, optionnelle (défaut : 6rem)
  rotate?: number    // inclinaison en degrés, optionnelle (défaut : 0)
}

// Les mots apparaissent dans l'ordre de cette liste
const words: RotatingWord[] = [
  { text: 'design', color: '#39803C', top: '25vh', left: '38vw' },
  { text: 'développement Web', color: '#FFA0A0', top: '40vh', left: '20vw' },
  { text: 'marketing', color: '#70BBE6', top: '55vh', left: '56vw' }
]
</script>

<template>
  <div class="rotating-text">
    <p class="rotating-static">Un mélange de</p>

    <span
      v-for="(word, i) in words"
      :key="word.text"
      class="rotating-word"
      :style="{
        '--i': i,
        top: word.top,
        left: word.left,
        color: word.color,
        fontSize: word.size,
        transform: word.rotate ? `rotate(${word.rotate}deg)` : undefined
      }"
    >
      {{ word.text }}
    </span>
  </div>
</template>

<style scoped>
.rotating-text {
  --delay-start: 0.3s;     /* attente avant la première apparition */
  --delay-step: 0.55s;     /* délai entre l'apparition de chaque mot */

  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;    /* ne gêne pas le scroll ni les clics */
  font-size: clamp(1.5rem, 3.5vw, 3rem);
  line-height: 1.2;
  font-synthesis: none;    /* empêche le navigateur de fabriquer un faux gras / faux italique */
}

/* Début de la phrase */
.rotating-static {
  position: absolute;
  top: 18vh;               /* diminue pour monter */
  left: 15vw;              /* diminue pour aller plus à gauche */
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 2.8rem;
  color: #111111;
}

/* Chaque mot est placé librement avec son propre top / left */
.rotating-word {
  position: absolute;
  white-space: nowrap;
  font-family: var(--font-title);
  font-size: 5rem;
  line-height: 1;

  /* "both" : invisible avant son tour, puis reste visible une fois apparu */
  animation: reveal 0.9s ease-out both;
  animation-delay: calc(var(--delay-start) + (var(--i) + 1) * var(--delay-step));
}

/* Flou → net */
@keyframes reveal {
  from {
    opacity: 0;
    filter: blur(12px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}

/* Si l'utilisateur a demandé moins d'animations : tout est visible tout de suite */
@media (prefers-reduced-motion: reduce) {
  .rotating-static,
  .rotating-word {
    animation: none;
  }
}

.hero-name {
  display: none;   /* uniquement visible sur mobile */
}

@media (max-width: 1023px) {
  .viewport-wrapper {
    width: 100%;
    height: auto;          /* le contenu peut maintenant dépasser et défiler */
    overflow: visible;
  }

  .horizontal-container {
    gap: 0;
    padding: 0;
  }

  /* Accueil : nom + mots, centrés dans le premier écran */
  .text-slide {
    min-height: 100vh;
    min-height: 100svh;    /* tient compte de la barre d'adresse mobile */
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 6rem 6vw 3rem;
  }

  .video-mask-wrapper {
    display: none;
  }

  .hero-name {
    display: block;
    font-family: var(--font-background);
    font-weight: normal;
    font-size: clamp(3.2rem, 17vw, 6rem);
    line-height: 0.95;
    color: #39803c;
  }
}
</style>