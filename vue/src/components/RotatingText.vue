<script setup lang="ts">
interface RotatingWord {
  text: string;
  color: string;
  top: string; // distance depuis le haut de l'écran (ex. '30vh')
  left: string; // distance depuis la gauche de l'écran (ex. '40vw')
  size?: string; // taille de police, optionnelle (défaut : 6rem)
  rotate?: number; // inclinaison en degrés, optionnelle (défaut : 0)
}

// Les mots apparaissent dans l'ordre de cette liste
const words: RotatingWord[] = [
  { text: "design", color: "#39803C", top: "25vh", left: "38vw" },
  { text: "développement web", color: "#FFA0A0", top: "40vh", left: "20vw" },
  { text: "marketing", color: "#70BBE6", top: "55vh", left: "56vw" },
];
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
        transform: word.rotate ? `rotate(${word.rotate}deg)` : undefined,
      }"
    >
      {{ word.text }}
    </span>
  </div>
</template>

<style scoped>
.rotating-text {
  --delay-start: 0.3s; /* attente avant la première apparition */
  --delay-step: 0.55s; /* délai entre l'apparition de chaque mot */

  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none; /* ne gêne pas le scroll ni les clics */
  font-size: clamp(1.4rem, min(5vh, 3.2vw), 2.8125rem);
  line-height: 1.2;
  font-synthesis: none; /* empêche le navigateur de fabriquer un faux gras / faux italique */
}

/* Début de la phrase */
.rotating-static {
  position: absolute;
  top: 18vh; /* diminue pour monter */
  left: 15vw; /* diminue pour aller plus à gauche */
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
  font-size: clamp(3rem, min(10.5vh, 7.5vw), 6rem);
  line-height: 1;

  /* "both" : invisible avant son tour, puis reste visible une fois apparu */
  animation: reveal 0.9s ease-out both;
  animation-delay: calc(
    var(--delay-start) + (var(--i) + 1) * var(--delay-step)
  );
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

@media (max-width: 1023px) {
  .rotating-text {
    position: static;
    width: 100%;
  }

  .rotating-static {
    font-size: clamp(1rem, 4.4vw, 1.6rem);
    position: relative;
    top: -2vh; /* positif = descend, négatif = monte */
    left: 0;
    font-size: clamp(1.7rem, 4.4vw, 1.6rem);
  }

  .rotating-word {
    position: static;
    display: block;
    width: fit-content;
    margin-right: auto; /* petit escalier */
    margin-left: calc(var(--i) * 0vw); /* escalier vers la gauche */
    max-width: calc(100% - var(--i) * 5vw);
    font-size: clamp(2rem, 8.6vw, 4rem); /* était 12vw : trop grand */
    line-height: 1.2;
    white-space: normal;
    overflow-wrap: anywhere;
    transform: none !important;
    margin-top: 2rem;
  }
}
</style>
