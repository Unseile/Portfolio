<script setup lang="ts">
import { onMounted, ref } from "vue";
import { siteReady } from "../composables/usePreloader";

const MIN_DURATION = 1600; // ms : durée minimale d'affichage
const MAX_DURATION = 5000; // ms : au-delà, on affiche le site quoi qu'il arrive
const ONCE_PER_SESSION = false; // true : le voile ne s'affiche qu'à la première page de la visite

// Polices du site (variables de fonts.css) à charger avant de dévoiler le site
const FONT_VARS = [
  "--font-chapter",
  "--font-title",
  "--font-body",
  "--font-background",
  "--font-project-body",
  "--font-project-skill",
  "--font-logo",
];

const seen = (() => {
  if (!ONCE_PER_SESSION) return false;
  try {
    return sessionStorage.getItem("preloaded") === "1";
  } catch {
    return false;
  }
})();

const visible = ref(!seen);
const nameReady = ref(false);
if (seen) siteReady.value = true;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const pageLoaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((resolve) =>
        window.addEventListener("load", () => resolve(), { once: true }),
      );

const loadFonts = (vars: string[]) => {
  if (!document.fonts) return Promise.resolve();
  const root = getComputedStyle(document.documentElement);
  const loads = vars
    .map((v) => root.getPropertyValue(v).trim())
    .filter(Boolean)
    .map((family) => document.fonts.load(`1em ${family}`));
  return Promise.allSettled(loads).then(() => undefined);
};

const finish = () => {
  try {
    sessionStorage.setItem("preloaded", "1");
  } catch {
    /* navigation privée : on ignore */
  }
  siteReady.value = true; // lance les animations de la page
  visible.value = false; // le voile s'efface
};

onMounted(async () => {
  if (seen) return;

  // Le nom apparaît dès que sa police est prête (ou après 1 s au plus)
  Promise.race([loadFonts(["--font-chapter"]), wait(1000)]).then(() => {
    nameReady.value = true;
  });

  await Promise.race([
    Promise.all([loadFonts(FONT_VARS), pageLoaded(), wait(MIN_DURATION)]),
    wait(MAX_DURATION),
  ]);

  finish();
});
</script>

<template>
  <Transition name="preloader">
    <div
      v-if="visible"
      class="preloader"
      role="status"
      aria-label="Chargement"
      @wheel.stop.prevent
      @touchmove.stop.prevent
    >
      <p class="preloader-name" :class="{ 'is-visible': nameReady }">
        Léa Häberli
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 1000; /* au-dessus du menu (100) */
  display: grid;
  place-items: center;
  background: #ffffff;
}

.preloader-name {
  font-family: var(--font-logo);
  font-weight: normal;
  font-size: clamp(2rem, 8vw, 4rem);
  line-height: 1;
  color: #111111;
  opacity: 0;
  filter: blur(12px);
  transition:
    opacity 0.9s ease-out,
    filter 0.9s ease-out;
}

/* Même effet « flou → net » que les mots de l'accueil */
.preloader-name.is-visible {
  opacity: 1;
  filter: blur(0);
}

/* Sortie : le voile s'enlève comme un rideau */
.preloader-leave-active {
  transition: transform 0.8s cubic-bezier(0.7, 0, 0.2, 1);
}
.preloader-leave-to {
  transform: translateY(-100%);
}

@media (prefers-reduced-motion: reduce) {
  .preloader-name,
  .preloader-leave-active {
    transition: none;
  }
}
</style>
