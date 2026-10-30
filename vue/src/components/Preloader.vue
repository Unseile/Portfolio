<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { siteReady } from "../composables/usePreloader";

const MIN_DURATION = 1600; // ms : durée minimale d'affichage
const MAX_DURATION = 12000; // ms : filet de sécurité si une ressource ne répond pas
const WAIT_FOR_ALL_IMAGES = true; // false : n'attend que la vidéo et les polices
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

const router = useRouter();

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

/* --- Avancement (pour la barre) --- */
const total = ref(0);
const done = ref(0);
const progress = computed(() => (total.value ? done.value / total.value : 0));

// Compte une tâche dans la barre de progression
const track = (task: Promise<unknown>) => {
  total.value++;
  return task.finally(() => {
    done.value++;
  });
};

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

const imageReady = (img: HTMLImageElement) => {
  img.loading = "eager"; // force le chargement des images « lazy » qui sont hors écran
  if (img.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
};

const videoReady = (video: HTMLVideoElement) => {
  video.preload = "auto";
  if (video.readyState >= 4) return Promise.resolve(); // assez de données pour tout lire
  return new Promise<void>((resolve) => {
    video.addEventListener("canplaythrough", () => resolve(), { once: true });
    video.addEventListener("error", () => resolve(), { once: true });
  });
};

const loadEverything = async () => {
  // La page de la route doit être dans le DOM avant de chercher ses ressources
  await router.isReady();
  await nextTick();

  const tasks: Promise<unknown>[] = [
    wait(MIN_DURATION),
    track(loadFonts(FONT_VARS)),
    track(pageLoaded()),
  ];

  document
    .querySelectorAll<HTMLVideoElement>("#app video")
    .forEach((video) => tasks.push(track(videoReady(video))));

  if (WAIT_FOR_ALL_IMAGES) {
    document
      .querySelectorAll<HTMLImageElement>("#app img")
      .forEach((img) => tasks.push(track(imageReady(img))));
  }

  await Promise.all(tasks);
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

  await Promise.race([loadEverything(), wait(MAX_DURATION)]);
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

      <div class="preloader-bar" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progress})` }"></span>
      </div>
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
  font-size: clamp(2.2rem, 8vw, 5rem);
  line-height: 1;
  color: #111111;
  opacity: 0;
  filter: blur(12px);
  transition:
    opacity 0.9s ease-out,
    filter 0.9s ease-out;
}

.preloader-name.is-visible {
  opacity: 1;
  filter: blur(0);
}

/* Fine barre de progression sous le nom */
.preloader-bar {
  position: absolute;
  top: calc(50% + 3.5rem);
  left: 50%;
  width: min(35rem, 40vw);
  height: 2.5px;
  background: rgba(17, 17, 17, 0.1);
  transform: translateX(-50%);
  overflow: hidden;
}

.preloader-bar span {
  display: block;
  width: 100%;
  height: 100%;
  background: #111111;
  transform-origin: left;
  transition: transform 0.3s ease-out;
}

.preloader-leave-active {
  transition: transform 0.8s cubic-bezier(0.7, 0, 0.2, 1);
}
.preloader-leave-to {
  transform: translateY(-100%);
}

@media (prefers-reduced-motion: reduce) {
  .preloader-name,
  .preloader-bar span,
  .preloader-leave-active {
    transition: none;
  }
}

@media (max-width: 1023px) {
  .preloader-bar {
    width: 14rem;
    top: calc(50% + 2rem);
    height: 1.5px;
  }
}
</style>
