<script setup lang="ts">
interface NavLink {
  label: string
  href: string
}

const links: NavLink[] = [
  { label: 'Biographie', href: '#portrait' },
  { label: 'Projets', href: '#projets' },
  { label: 'Contact', href: '#contact' }
]
</script>

<template>
  <header class="navbar">
    <a class="navbar-brand" href="#">Léa Häberli</a>

    <nav class="navbar-links" aria-label="Navigation principale">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        class="navbar-link"
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


.navbar-link {
  pointer-events: auto; /* mais les liens restent cliquables */
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-family: var(--font-body);
}

.navbar-brand {
  pointer-events: auto; /* mais les liens restent cliquables */
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-size: 1.5rem;
  font-family: var(--font-logo);
}

.navbar-links {
  display: flex;
  gap: 2.5rem;
}

.navbar-link {
  font-size: 1rem;
  position: relative;
}

/* Soulignement animé au survol */
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