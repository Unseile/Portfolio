<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import Navbar from "./Navbar.vue";
import RotatingText from "./RotatingText.vue";
import ImageSection from "./Portrait.vue";
import ProjectSection from "./ProjectSection.vue";

// Import de la vidéo depuis le dossier assets
import videoSource from "../assets/video/fleurs.mp4";
import bgImage from "../assets/image/tree.jpg";
import projectHUG from "../assets/image/mockup_hug.png"
import projectEtoileBlanche from "../assets/image/etoile_blanche.png"
import projectNoraa from "../assets/image/noraa.png"
import projectVisualDon from "../assets/image/visualisation.png"
import projectModterra from "../assets/image/modterra.png"

let goToSection: ((id: string) => void) | null = null;

const onNavigate = (id: string) => {
  // Desktop : défilement horizontal géré par GSAP
  if (goToSection) {
    goToSection(id);
    return;
  }
  // Mobile : défilement vertical natif
  if (!id) window.scrollTo({ top: 0, behavior: "smooth" });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

// Décalage des blocs de texte (fraction de la largeur d'écran) : négatif = vers la gauche
const BLOCK_SHIFT = -0.1;

const base = import.meta.env.BASE_URL;

gsap.registerPlugin(Observer);

const containerRef = ref<HTMLDivElement | null>(null);
let mm: gsap.MatchMedia | null = null;
let currentX = 0;

interface TextSlide {
  id: number;
  line: string;
}

const projects = [
  { id: "hug",   image: projectHUG,           numberColor: "#39803C", /* ... */ },
  { id: "etoile", image: projectEtoileBlanche, numberColor: "#FFA0A0", /* ... */ },
  { id: "noraa", image: projectNoraa,          numberColor: "#70BBE6", /* ... */ },
  { id: "visu",  image: projectVisualDon,     numberColor: "#94E998", /* ... */ },
  { id: "shop",  image: projectModterra,      numberColor: "#F2A900", /* ... */ },
];

// Distance parcourue par la colonne pendant le passage d'une section (en hauteurs d'écran)
const NUMBER_SHIFT = 1.2;

// Décalage des mots (fraction de la largeur d'écran), atteint quand la 1re section a quitté l'écran
const WORD_SHIFT = 0.08;
const MES_SHIFT = -0.2;

const angle = ref(-2.5) // en degrés : négatif = vers le haut (sens anti-horaire), positif = vers le bas

const slides: TextSlide[] = [{ id: 1, line: "Häberli" }];

/* --- Dimensions réactives pour positionner le texte du clipPath en pixels --- */
const vw = ref(window.innerWidth);
const vh = ref(window.innerHeight);
const isDesktop = computed(() => vw.value >= 1024);

// Hauteur de la zone vidéo : 100vh sur desktop, 45vh sur mobile (doit correspondre au CSS)
const boxH = computed(() => (isDesktop.value ? vh.value : vh.value * 0.45));

const fontSize = computed(() =>
  isDesktop.value
    ? vh.value * 0.75
    : Math.min(vw.value * 0.32, boxH.value * 0.42),
);
// La rotation se fait autour du coin bas-gauche du texte, donc il reste ancré en bas
const rotation = computed(() => `rotate(${angle.value} ${textX.value} ${y2.value})`)
const padBottom = computed(() => boxH.value * -0.88);
const textX = computed(() => vw.value * -0.04);
const y2 = computed(() => boxH.value - padBottom.value); // baseline de la ligne du bas
const y1 = computed(() => y2.value - fontSize.value * 0.85); // baseline de la ligne du haut

const onResize = () => {
  vw.value = window.innerWidth;
  vh.value = window.innerHeight;
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  mm = gsap.matchMedia();

  // --- DESKTOP (≥ 1024px) : Défilement horizontal unique ---
  // Décalage supplémentaire du texte vers la gauche, en fraction de la largeur d'écran
  const TEXT_SHIFT = 0.15;

  // --- DESKTOP (≥ 1024px) : défilement horizontal ---
  mm.add("(min-width: 1024px)", () => {
  document.body.style.overflow = "hidden";

  const container = containerRef.value;
  if (!container) return;

  const textBoxes = container.querySelectorAll<HTMLElement>(".video-mask-wrapper");
  const numberTracks = container.querySelectorAll<HTMLElement>(".title-section-numbers-track");
  const blocks = container.querySelectorAll<HTMLElement>(".title-section-block");
  const mes = container.querySelector<HTMLElement>(".title-section-line-1");
  const mesSection = mes?.closest<HTMLElement>(".title-section") ?? null;
  const words = container.querySelectorAll<HTMLElement>(".rotating-word");
  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  // 0 quand la section arrive par la droite, 1 quand elle a quitté l'écran par la gauche
  const sectionProgress = (section: HTMLElement) => {
    const sectionLeft =
      section.getBoundingClientRect().left - container.getBoundingClientRect().left;
    const leftOnScreen = sectionLeft + currentX;
    return gsap.utils.clamp(
      0,
      1,
      (window.innerWidth - leftOnScreen) / (window.innerWidth + section.offsetWidth),
    );
  };

  // Applique la position courante (currentX) à tous les éléments animés
  const update = (duration = 0.8) => {
    const maxX = container.scrollWidth - window.innerWidth;
    const opts: gsap.TweenVars = { duration, ease: "power2.out", overwrite: "auto" };

    gsap.to(container, { x: currentX, ...opts });

    const progress = maxX > 0 ? -currentX / maxX : 0;
    gsap.to(textBoxes, { x: -progress * window.innerWidth * TEXT_SHIFT, ...opts });

    const intro = gsap.utils.clamp(0, 1, -currentX / window.innerWidth);
    const shift = intro * window.innerWidth * WORD_SHIFT;
    if (firstWord) gsap.to(firstWord, { x: shift, ...opts });
    if (lastWord && lastWord !== firstWord) gsap.to(lastWord, { x: -shift, ...opts });

    if (mes && mesSection) {
      gsap.to(mes, {
        x: sectionProgress(mesSection) * window.innerWidth * MES_SHIFT,
        ...opts,
      });
    }

    numberTracks.forEach((track) => {
      const section = track.closest<HTMLElement>(".title-section");
      if (!section) return;
      gsap.to(track, {
        y: -sectionProgress(section) * window.innerHeight * NUMBER_SHIFT,
        ...opts,
      });
    });

    blocks.forEach((block) => {
      const section = block.closest<HTMLElement>(".title-section");
      if (!section) return;
      gsap.to(block, {
        x: sectionProgress(section) * window.innerWidth * BLOCK_SHIFT,
        ...opts,
      });
    });
  };

  // Clic dans le menu : on amène le bord gauche de la section au bord gauche de l'écran
  goToSection = (id: string) => {
    const maxX = container.scrollWidth - window.innerWidth;
    let target = 0; // id vide : retour au début

    if (id) {
      const section = container.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
      if (!section) return;
      const left =
        section.getBoundingClientRect().left - container.getBoundingClientRect().left;
      target = -left;
    }

    currentX = gsap.utils.clamp(-maxX, 0, target);
    update(1.2); // un peu plus lent qu'un scroll à la molette
  };

  // Empêche le navigateur d'interpréter le geste comme "page précédente / suivante"
  const blockNativeWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // laisse passer le zoom
    e.preventDefault();
  };
  window.addEventListener("wheel", blockNativeWheel, { passive: false });

  const observer = Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onChange: (self) => {
      const maxX = container.scrollWidth - window.innerWidth;
      const delta =
        Math.abs(self.deltaX) > Math.abs(self.deltaY) ? self.deltaX : self.deltaY;

      currentX = gsap.utils.clamp(-maxX, 0, currentX + delta);
      update();
    },
  });

  return () => {
    goToSection = null;
    window.removeEventListener("wheel", blockNativeWheel);
    document.body.style.overflow = "";
    observer.kill();
    gsap.set(container, { clearProps: "all" });
    gsap.set(textBoxes, { clearProps: "transform" });
    gsap.set([firstWord, lastWord].filter(Boolean), { clearProps: "transform" });
    if (mes) gsap.set(mes, { clearProps: "transform" });
    gsap.set(numberTracks, { clearProps: "transform" });
    gsap.set(blocks, { clearProps: "transform" });
    currentX = 0;
  };
});

  // --- MOBILE (< 1024px) : Scroll vertical naturel ---
  mm.add("(max-width: 1023px)", () => {
    document.body.style.overflow = "auto";
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  if (mm) mm.revert();
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="viewport-wrapper">
    <Navbar @navigate="onNavigate" />
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
            :transform="rotation"
            style="font-family: var(--font-background)"
          >
            {{ slide.line }}
          </text>
        </clipPath>
      </defs>
    </svg>

    <!-- Conteneur défilant -->
    <div ref="containerRef" class="horizontal-container">
      <div v-for="slide in slides" :key="slide.id" class="text-slide">
        <div class="video-mask-wrapper">
          <!-- La vidéo découpée par le texte -->
          <video v-if="isDesktop"
            class="clipped-video"
            :style="{
              clipPath: `url(#text-clip-${slide.id})`,
              WebkitClipPath: `url(#text-clip-${slide.id})`,
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
      </div>

      <ProjectSection
        id="projets"
        number="1"
        number-color="#70BBE6"
        line1="Mes"
        line2="Projets"
        :image="projectHUG"
        image-alt="Description de l'image"
        skill="Marketing / Développement full-stack / Product Owner"
        title="HUG"
        text="Une plateforme web pour les HUG et le Centre de transfusion sanguine de Genève."
        button="Voir le projet"
      />

      <ProjectSection
        number="2"
        number-color="#FFA0A0"
        :image="projectEtoileBlanche"
        image-alt="Description de l'image"
        skill="Marketing / Communication"
        title="Etoile Blanche"
        text="Renforcement de l’image de l'Étoile Blanche, restaurant et bar dansant au cœur de Lausanne. "
        button="Voir le projet"
      />

      <ProjectSection
        number="3"
        number-color="#94E998"
        :image="projectNoraa"
        image-alt="Description de l'image"
        skill="Design UX / Design UI"
        title="Noraa"
        text="Une plateforme web pour les HUG et le Centre de transfusion sanguine de Genève."
        button="Voir le projet"
      />

      <ProjectSection
        number="4"
        number-color="#70BBE6"
        data-nav-theme="dark"
        :image="projectVisualDon"
        image-alt="Description de l'image"
        skill="Developpement full-stack"
        title="Visualisation des données"
        text="Une plateforme web pour les HUG et le Centre de transfusion sanguine de Genève."
        button="Voir le projet"
      />

      <ProjectSection
        number="5"
        number-color="#FFA0A0"
        :image="projectModterra"
        image-alt="Description de l'image"
        skill="Marketing / Communication"
        title="E-commerce"
        text="Conception et mise en ligne d’une boutique fictive de bijoux en céramique faits main."
        button="Voir le projet"
      />

      <ImageSection
        id="portrait"
        :background="bgImage"
        image-alt="Portrait de Léa Häberli"
        email="lea.haberli02@gmail.com"
        linkedin="léa häberli"
        linkedin-url="https://www.linkedin.com/in/l%C3%A9a-h%C3%A4berli-1a3418307/"
        title="Léa Häberli"
        text="Etudiante en Ingénierie des médias à la HEIG-VD, à Yverdon-les-Bains. J'aime les projets qui mélangent le design, le développement web et la stratégie marketing."
        text2="Au fil de mes études, jai conçu des applications web, travaillé en équipe agile et établir des stratégies de communication pour de vrais mandants."
        align="center"
        :cv-url="`${base}CV.pdf`"
        cv-filename="CV.pdf"
      />

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
  position: relative;
  z-index: 1; /* au-dessus de l'image de fond, sous le bloc de la slide 2 */
  width: 100%;
  min-height: 45vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-shrink: 0;
}

.video-mask-wrapper {
  flex: 0 0 auto;
  pointer-events: none;
  width: 100vw;
  height: 45vh; /* doit correspondre à boxH dans le script (vh * 0.45) */
  position: relative;
}

.clipped-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center -30%;
  display: block;
}

/* --- DESKTOP (≥ 1024px) : défilement horizontal --- */
@media (min-width: 1024px) {
  .viewport-wrapper {
    --slide-w: 100vw; /* la slide 2 commence ici */
    --text-w: 115vw; /* zone du texte : assez large pour tout le nom */
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
    width: var(--text-w);
    height: 100vh; /* doit correspondre à boxH (vh * 1) */
  }
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
}
</style>
