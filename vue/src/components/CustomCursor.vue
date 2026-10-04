<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const dotRef = ref<HTMLDivElement | null>(null)
const ringRef = ref<HTMLDivElement | null>(null)
const label = ref('')
const active = ref(false)

/* --- Réglages --- */
const RING = 36          // taille normale de l'anneau (px)
const RING_HOVER = 70    // au-dessus d'un lien ou d'un bouton
const RING_LABEL = 92    // quand un mot est affiché

let moveDotX: ((v: number) => void) | null = null
let moveDotY: ((v: number) => void) | null = null
let moveRingX: ((v: number) => void) | null = null
let moveRingY: ((v: number) => void) | null = null
let visible = false
let currentSize = RING
let mx = 0
let my = 0
let recheckUntil = 0

/* Met à jour l'état de l'anneau selon l'élément sous le curseur */
function updateHover(el: Element | null) {
  const target = el?.closest<HTMLElement>('a, button, [data-cursor-label], [data-cursor]') ?? null
  const text = target?.dataset.cursorLabel ?? ''
  const size = text ? RING_LABEL : target ? RING_HOVER : RING

  if (size === currentSize && text === label.value) return
  currentSize = size
  label.value = text
  active.value = !!target

  gsap.to(ringRef.value, { width: size, height: size, duration: 0.3, ease: 'power3.out' })
  gsap.to(dotRef.value, { scale: text ? 0 : 1, duration: 0.2 })
}

function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  mx = e.clientX
  my = e.clientY

  // Première position : le curseur apparaît sous la souris au lieu de venir du coin
  if (!visible) {
    gsap.set([dotRef.value, ringRef.value], { x: mx, y: my })
    gsap.to([dotRef.value, ringRef.value], { opacity: 1, duration: 0.3 })
    visible = true
  }

  moveDotX?.(mx)
  moveDotY?.(my)
  moveRingX?.(mx)
  moveRingY?.(my)
}

function onOver(e: PointerEvent) {
  updateHover(e.target as Element | null)
}

function onLeave() {
  gsap.to([dotRef.value, ringRef.value], { opacity: 0, duration: 0.3 })
  visible = false
}

function onDown() {
  gsap.to(ringRef.value, { scale: 0.85, duration: 0.15 })
}

function onUp() {
  gsap.to(ringRef.value, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
}

/* Pendant le scroll, le contenu défile sous un curseur immobile : on revérifie ce qu'il y a dessous */
function onWheel() {
  recheckUntil = performance.now() + 1200
}

function tick() {
  if (visible && performance.now() < recheckUntil) {
    updateHover(document.elementFromPoint(mx, my))
  }
}

onMounted(() => {
  const dot = dotRef.value
  const ring = ringRef.value
  if (!dot || !ring) return

  // Pas de curseur personnalisé sur écran tactile
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 }) // centrés sur la souris
  moveDotX = gsap.quickTo(dot, 'x', { duration: reduce ? 0 : 0.06, ease: 'power3' })
  moveDotY = gsap.quickTo(dot, 'y', { duration: reduce ? 0 : 0.06, ease: 'power3' })
  moveRingX = gsap.quickTo(ring, 'x', { duration: reduce ? 0 : 0.35, ease: 'power3' })
  moveRingY = gsap.quickTo(ring, 'y', { duration: reduce ? 0 : 0.35, ease: 'power3' })

  document.documentElement.classList.add('has-custom-cursor') // masque le curseur natif

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerover', onOver)
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('wheel', onWheel, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  gsap.ticker.add(tick)
})

onUnmounted(() => {
  document.documentElement.classList.remove('has-custom-cursor')
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerover', onOver)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('wheel', onWheel)
  document.documentElement.removeEventListener('pointerleave', onLeave)
  gsap.ticker.remove(tick)
  gsap.killTweensOf([dotRef.value, ringRef.value])
})
</script>

<template>
  <div ref="ringRef" class="cursor-ring" :class="{ 'is-active': active }" aria-hidden="true">
    <span class="cursor-label">{{ label }}</span>
  </div>
  <div ref="dotRef" class="cursor-dot" aria-hidden="true" />
</template>

<style scoped>
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;               /* au-dessus de tout, menu compris */
  opacity: 0;                  /* invisible tant que la souris n'a pas bougé */
  mix-blend-mode: difference;  /* reste visible sur fond clair comme sur fond sombre */
  will-change: transform;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
}

.cursor-ring {
  width: 36px;
  height: 36px;
  border: 1.5px solid #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.25s ease;
}

.cursor-ring.is-active {
  background-color: rgba(255, 255, 255, 0.112);
}

.cursor-label {
  font-family: var(--font-logo);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffffff;
  white-space: nowrap;
}

/* Écrans tactiles : pas de curseur personnalisé */
@media (hover: none) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
}
</style>

<!-- Non scopé : cache le curseur natif, seulement quand le curseur personnalisé est actif -->
<style>
html.has-custom-cursor,
html.has-custom-cursor * {
  cursor: none;
}
</style>