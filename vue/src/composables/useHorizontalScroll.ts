import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

export interface ScrollState {
  x: number          // position du ruban (négative)
  maxX: number       // position maximale
  duration: number   // durée de l'animation en cours
}

interface Options {
  minWidth?: number
  onUpdate?: (state: ScrollState) => void   // à chaque déplacement du ruban
  onReset?: () => void                      // retour au début, ou fin du mode horizontal
}

export function useHorizontalScroll(
  containerRef: Ref<HTMLElement | null>,
  options: Options = {},
) {
  const { minWidth = 1024, onUpdate, onReset } = options

  let mm: gsap.MatchMedia | null = null
  let currentX = 0
  let active = false

  // Retour au début (changement de projet)
  const reset = () => {
    currentX = 0
    if (active && containerRef.value) gsap.set(containerRef.value, { x: 0 })
    onReset?.()
  }

  onMounted(() => {
    mm = gsap.matchMedia()

    mm.add(`(min-width: ${minWidth}px)`, () => {
      const container = containerRef.value
      if (!container) return

      active = true
      document.body.style.overflow = 'hidden'

      // Empêche le navigateur d'interpréter le geste comme "page précédente / suivante"
      const blockNativeWheel = (e: WheelEvent) => {
        if (e.ctrlKey) return // laisse passer le zoom
        e.preventDefault()
      }
      window.addEventListener('wheel', blockNativeWheel, { passive: false })

      const observer = Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        onChange: (self) => {
          const maxX = container.scrollWidth - window.innerWidth
          const delta =
            Math.abs(self.deltaX) > Math.abs(self.deltaY) ? self.deltaX : self.deltaY

          currentX = gsap.utils.clamp(-maxX, 0, currentX + delta)
          gsap.to(container, { x: currentX, duration: 0.8, ease: 'power2.out', overwrite: 'auto' })

          onUpdate?.({ x: currentX, maxX, duration: 0.8 })
        },
      })

      return () => {
        active = false
        window.removeEventListener('wheel', blockNativeWheel)
        observer.kill()
        gsap.set(container, { clearProps: 'transform' })
        document.body.style.overflow = ''
        currentX = 0
        onReset?.()
      }
    })
  })

  onUnmounted(() => {
    mm?.revert()
  })

  return { reset }
}