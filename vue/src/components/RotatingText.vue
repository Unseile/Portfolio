<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface RotatingWord {
  text: string
  color: string
}

// Une couleur par mot : à adapter à ta palette (ou à remplacer par var(--ta-couleur))
const words: RotatingWord[] = [
  { text: 'design', color: '#39803C' },
  { text: 'développement Web', color: '#FFA0A0' },
  { text: 'marketing', color: '#70BBE6' }
]

const index = ref(0)
const current = computed(() => words[index.value])
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    index.value = (index.value + 1) % words.length
  }, 5000) // changement toutes les 5 secondes
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="rotating-text">
    <p class="rotating-static">Le mélange de</p>

    <div class="rotating-word-wrap">
      <Transition name="blur" mode="out-in">
        <span
          :key="current.text"
          class="rotating-word"
          :style="{ color: current.color }"
        >
          {{ current.text }}
        </span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.rotating-text {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;    /* ne gêne pas le scroll ni les clics */
  font-size: clamp(1.5rem, 3.5vw, 3rem);
  line-height: 1.2;
  font-synthesis: none;    /* empêche le navigateur de fabriquer un faux gras / faux italique */
}

/* Début de la phrase : plus haut et un peu à gauche du mot */
.rotating-static {
  position: absolute;
  top: 25vh;               /* diminue pour monter */
  left: 20vw;              /* diminue pour aller plus à gauche */
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 2.8125rem;
  color: #111111;
}

/* Mot : centré au milieu de l'écran, il reste centré quelle que soit sa longueur */
.rotating-word-wrap {
  position: absolute;
  top: 40%;
  left: 50vw;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

.rotating-word {
  display: inline-block;
  font-family: var(--font-title);
  font-size: 6.875rem;
}

/* Animation de flou : le mot se floute en disparaissant, le suivant se précise en arrivant */
.blur-enter-active,
.blur-leave-active {
  transition: filter 0.4s ease, opacity 0.4s ease;
}

.blur-enter-from,
.blur-leave-to {
  filter: blur(12px);
  opacity: 0;
}
</style>