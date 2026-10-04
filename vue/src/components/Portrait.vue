<script setup lang="ts">
withDefaults(
  defineProps<{
    background: string; // image plein écran
    image: string; // image dans le bloc
    title: string;
    text: string;
    text2?: string; // optionnel : le 2e paragraphe n'est affiché que s'il existe
    imageAlt?: string;
    align?: "left" | "center" | "right"; // position du bloc sur l'image
    cvUrl?: string;
    cvFilename?: string;
  }>(),
  {
    text2: "",
    imageAlt: "",
    align: "center",
  },
);
</script>

<template>
  <section class="image-section" :class="`align-${align}`">
    <!-- Image de fond -->
    <img class="image-section-bg" :src="background" alt="" decoding="async" />

    <!-- Bloc par-dessus -->
    <div class="image-section-block">
      <div class="image-section-photo">
        <img :src="image" :alt="imageAlt" loading="lazy" decoding="async" />
      </div>

      <div class="image-section-content">
        <h2 class="image-section-title">{{ title }}</h2>
        <p class="image-section-text">{{ text }}</p>
        <p v-if="text2" class="image-section-text">{{ text2 }}</p>
        <div v-if="cvUrl" class="image-section-actions">
          <a
            class="cv-button cv-button--see"
            :href="cvUrl"
            target="_blank"
            rel="noopener"
          >
            Voir le CV
          </a>
          <a
            class="cv-button cv-button--ghost"
            :href="cvUrl"
            :download="cvFilename"
          >
            Télécharger
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.image-section {
  position: relative;
  flex: 0 0 auto; /* ne se rétrécit pas dans le conteneur flex */
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 5vw 3rem; /* le haut laisse la place au menu fixe */
  overflow: hidden;
}

.align-left {
  justify-content: flex-start;
}
.align-right {
  justify-content: flex-end;
}

/* Image de fond qui remplit tout l'espace sans se déformer */
.image-section-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Bloc : image + texte côte à côte, sans marge interne */
.image-section-block {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 0; /* plus d'espace entre l'image et le texte */
  align-items: stretch; /* l'image prend toute la hauteur du bloc */
  width: min(72vw, 62rem);
  padding: 0; /* ← plus de marge interne sur le bloc */
  overflow: hidden; /* l'image suit les coins arrondis du bloc */
  border-radius: 5rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* Image : remplit toute sa colonne, bord à bord */
.image-section-photo {
  position: relative;
  min-height: 26rem; /* hauteur minimale du bloc si le texte est court */
}

.image-section-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Texte : c'est lui qui porte les marges internes */
.image-section-content {
  align-self: center;
  padding: 2.5rem;
}

.image-section-title {
  margin-bottom: 1rem;
  font-family: var(--font-title);
  font-size: 2.8rem;
  color: #94e998;
}

.image-section-text {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.6;
  color: #ffffff;
}

.image-section-text + .image-section-text {
  margin-top: 2rem; /* espace entre les deux paragraphes */
}

.image-section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.cv-button {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  border: 1px solid #94e998;
  border-radius: 999px;
  background: #94e998;
  color: #111111;
  font-family: var(--font-body);
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;
}

.cv-button:hover {
  transform: translateY(-2px);
}

.cv-button--see:hover {
  background: #3e6c40;
  color: #ffffff;
  border-color: #3e6c40;
}

/* Bouton secondaire : contour seul */
.cv-button--ghost {
  background: transparent;
  color: #ffffff;
}

.cv-button--ghost:hover {
  background: #3e6c40;
  color: #ffffff;
  border-color: #3e6c40;
}

.cv-button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 3px;
}

/* --- MOBILE : l'image passe au-dessus du texte --- */
@media (max-width: 1023px) {
  .image-section {
    padding: 5rem 5vw 3rem;
    justify-content: center;
  }

  .image-section-block {
    grid-template-columns: 1fr;
    width: 100%;
    gap: 0;
    padding: 0;
    border-radius: 2.5rem; /* 5rem est trop arrondi sur un petit bloc */
  }

  .image-section-photo {
    min-height: 14rem;
  }

  .image-section-content {
    padding: 1.5rem;
  }
}
</style>
