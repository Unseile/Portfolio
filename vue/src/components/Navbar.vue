<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

interface NavLink {
  label: string
  href: string
}

const links: NavLink[] = [
  { label: 'Projets', href: '#projets' },
  { label: 'Portrait', href: '#portrait' }
]

// Le menu prévient le composant parent, qui gère le défilement
const emit = defineEmits<{ navigate: [id: string] }>()

const headerRef = ref<HTMLElement | null>(null)

/* --- Couleur selon l'arrière-plan --- */
function updateTheme() {
  const header = headerRef.value
  if (!header) return

  header.querySelectorAll<HTMLElement>('.navbar-brand, .navbar-link').forEach((el) => {
    const r = el.getBoundingClientRect()

    // Les éléments sous le point central, en ignorant le menu lui-même
    const under = document
      .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .filter((e) => !header.contains(e))

    // Premier élément qui déclare son thème (lui-même ou un de ses parents)
    let theme = 'light'
    for (const e of under) {
      const section = e.closest<HTMLElement>('[data-nav-theme]')
      if (section) {
        theme = section.dataset.navTheme === 'dark' ? 'dark' : 'light'
        break
      }
    }
    el.dataset.theme = theme
  })
}

// On ne vérifie que pendant l'activité (scroll, souris, clavier...) pour rester léger
let activeUntil = 0
const wake = () => {
  activeUntil = performance.now() + 2000
}
const tick = () => {
  if (performance.now() < activeUntil) updateTheme()
}
const wakeEvents = ['wheel', 'scroll', 'pointermove', 'pointerdown', 'keydown', 'resize']

onMounted(() => {
  wake()
  updateTheme()
  gsap.ticker.add(tick)
  wakeEvents.forEach((e) => window.addEventListener(e, wake, { passive: true }))
})

onUnmounted(() => {
  gsap.ticker.remove(tick)
  wakeEvents.forEach((e) => window.removeEventListener(e, wake))
})
</script>

<template>
  <header ref="headerRef" class="navbar">
    <a class="navbar-brand" href="#" @click.prevent="emit('navigate', '')">Léa Häberli</a>

    <nav class="navbar-links" aria-label="Navigation principale">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        class="navbar-link"
        @click.prevent="emit('navigate', link.href.slice(1))"
      >
        {{ link.label }}
      </a>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between; /* texte à gauche, liens à droite */
  align-items: center;
  padding: 1.5rem 4vw;
  pointer-events: none; /* le fond laisse passer les clics/scroll */
}

.navbar-brand,
.navbar-link {
  pointer-events: auto; /* mais les liens restent cliquables */
  color: #000000;
  text-decoration: none;
  transition: color 0.3s ease;
}

/* Fond sombre derrière : texte blanc */
.navbar-brand[data-theme='dark'],
.navbar-link[data-theme='dark'] {
  color: #ffffff;
}

.navbar-brand {
  font-size: 1.5rem;
  font-family: var(--font-logo);
}

.navbar-links {
  display: flex;
  gap: 2.5rem;
}

.navbar-link {
  font-size: 1rem;
  font-family: var(--font-body);
  position: relative;
}

/* Soulignement animé au survol (suit la couleur du texte) */
.navbar-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.navbar-link:hover::after {
  transform: scaleX(1);
}

/* Mobile : on réduit les espaces */
@media (max-width: 1023px) {
  .navbar {
    padding: 1rem 5vw;
  }

  .navbar-links {
    gap: 1.25rem;
  }

  .navbar-brand {
    font-size: 1.2rem;
  }
}
</style>