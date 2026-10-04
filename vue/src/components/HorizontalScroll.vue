<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import Navbar from './Navbar.vue'
import RotatingText from './RotatingText.vue'
import ImageSection from './Portrait.vue'

// Import de la vidéo depuis le dossier assets
import videoSource from '../assets/video/paquerette.mp4'
import bgImage from '../assets/image/landscape.jpeg'
import portrait from '../assets/image/landscape.jpeg'

gsap.registerPlugin(Observer)

const containerRef = ref<HTMLDivElement | null>(null)
let mm: gsap.MatchMedia | null = null
let currentX = 0

interface TextSlide {
  id: number
  line: string
}

const slides: TextSlide[] = [
  { id: 1, line: 'Léa Häberli' }
]

/* --- Dimensions réactives pour positionner le texte du clipPath en pixels --- */
const vw = ref(window.innerWidth)
const vh = ref(window.innerHeight)
const isDesktop = computed(() => vw.value >= 1024)

// Hauteur de la zone vidéo : 100vh sur desktop, 45vh sur mobile (doit correspondre au CSS)
const boxH = computed(() => (isDesktop.value ? vh.value : vh.value * 0.45))


const fontSize = computed(() =>
  isDesktop.value ? vh.value * 0.47 : Math.min(vw.value * 0.32, boxH.value * 0.42)
)
const padBottom = computed(() => boxH.value * -0.45)
const textX = computed(() => vw.value * -0.01)
const y2 = computed(() => boxH.value - padBottom.value)          // baseline de la ligne du bas
const y1 = computed(() => y2.value - fontSize.value * 0.85)      // baseline de la ligne du haut

const onResize = () => {
  vw.value = window.innerWidth
  vh.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  mm = gsap.matchMedia()

  // --- DESKTOP (≥ 1024px) : Défilement horizontal unique ---
  mm.add('(min-width: 1024px)', () => {
    document.body.style.overflow = 'hidden'

    const container = containerRef.value
    if (!container) return

    const observer = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onChange: (self) => {
        // Recalculé à chaque événement : reste correct après un redimensionnement
        const maxX = container.scrollWidth - window.innerWidth

        currentX += self.deltaY
        currentX = gsap.utils.clamp(-maxX, 0, currentX)

        gsap.to(container, {
          x: currentX,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }
    })

    return () => {
      document.body.style.overflow = ''
      observer.kill()
      if (container) gsap.set(container, { clearProps: 'all' })
      currentX = 0
    }
  })

  // --- MOBILE (< 1024px) : Scroll vertical naturel ---
  mm.add('(max-width: 1023px)', () => {
    document.body.style.overflow = 'auto'
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (mm) mm.revert()
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="viewport-wrapper">
    <Navbar />
    <!-- SVG global contenant la définition du masque pour chaque slide -->
    <svg class="svg-definitions" aria-hidden="true">
      <defs>
        <clipPath
          v-for="slide in slides"
          :key="'clip-' + slide.id"
          :id="'text-clip-' + slide.id"
          clipPathUnits="userSpaceOnUse"
        >
          <text
            :x="textX"
            :y="y1"
            :font-size="fontSize"
            style="font-family: var(--font-background);"
          >{{ slide.line }}</text>
        </clipPath>
      </defs>
    </svg>

    <!-- Conteneur défilant -->
    <div ref="containerRef" class="horizontal-container">
      <div
        v-for="slide in slides"
        :key="slide.id"
        class="text-slide"
      >
        <div class="video-mask-wrapper">
          <!-- La vidéo découpée par le texte -->
          <video
            class="clipped-video"
            :style="{
              clipPath: `url(#text-clip-${slide.id})`,
              WebkitClipPath: `url(#text-clip-${slide.id})`
            }"
            autoplay
            loop
            muted
            playsinline
          >
            <source :src="videoSource" type="video/mp4" />
          </video>
        </div>

        <RotatingText v-if="slide.id === 1" />

        <ImageSection
          :background="bgImage"
          :image="portrait"
          image-alt="Portrait de Léa Häberli"
          title="Biographie"
          text="Ton texte de présentation ici."
          align="center"
        />

      </div>
    </div>
  </div>
</template>

<style scoped>
.viewport-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}

/* Définitions SVG : ne surtout pas utiliser display:none (le clipPath ne fonctionnerait plus) */
.svg-definitions {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.svg-definitions text {
  font-family: var(--font-background, cursive);
}

/* --- MOBILE (< 1024px) : slides empilées verticalement --- */
.horizontal-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 0;
}

.text-slide {
  width: 100%;
  min-height: 45vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-shrink: 0;
}

.video-mask-wrapper {
  width: 100vw;
  height: 45vh; /* doit correspondre à boxH dans le script (vh * 0.45) */
  position: relative;
}

.clipped-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.text-slide {
  position: relative; /* ajouté */
  width: 100%;
  min-height: 45vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-shrink: 0;
}

/* --- DESKTOP (≥ 1024px) : défilement horizontal --- */
@media (min-width: 1024px) {
  .viewport-wrapper {
    --slide-w: 200vw; /* plus large que l'écran → le texte dépasse à droite */
  }

  .horizontal-container {
    flex-direction: row;
    width: max-content;
    height: 100vh;
    padding: 0;
    gap: 0;
    align-items: stretch;
  }

  .text-slide {
    width: var(--slide-w);
    height: 100vh;
    min-height: 0;
  }

  .video-mask-wrapper {
    width: var(--slide-w);
    height: 100vh; /* doit correspondre à boxH (vh * 1) */
  }
}
</style>