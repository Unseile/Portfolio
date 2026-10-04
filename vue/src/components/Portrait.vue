<script setup lang="ts">
withDefaults(
  defineProps<{
    background: string            // image plein écran
    image: string                 // image dans le bloc
    title: string
    text: string
    imageAlt?: string
    align?: 'left' | 'center' | 'right' // position du bloc sur l'image
  }>(),
  {
    imageAlt: '',
    align: 'center'
  }
)
</script>

<template>
  <section class="image-section" :class="`align-${align}`">
    <!-- Image de fond -->
    <img class="image-section-bg" :src="background" alt="" decoding="async" />

    <!-- Bloc par-dessus -->
    <div class="image-section-block">
      <div class="image-section-content">
        <h2 class="image-section-title">{{ title }}</h2>
        <p class="image-section-text">{{ text }}</p>
      </div>

      <img
        class="image-section-photo"
        :src="image"
        :alt="imageAlt"
        loading="lazy"
        decoding="async"
      />
    </div>
  </section>
</template>

<style scoped>
.image-section {
  position: relative;
  flex: 0 0 auto;          /* ne se rétrécit pas dans le conteneur flex */
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 5vw 3rem;  /* le haut laisse la place au menu fixe */
  overflow: hidden;
}

.align-left  { justify-content: flex-start; }
.align-right { justify-content: flex-end; }

/* Image de fond qui remplit tout l'espace sans se déformer */
.image-section-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Bloc : texte + image côte à côte */
.image-section-block {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 2.5rem;
  align-items: center;
  width: min(72vw, 62rem);
  padding: 2.5rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.25);
}

.image-section-title {
  margin-bottom: 1rem;
  font-family: var(--font-title);
  font-size: clamp(1.8rem, 3vw, 3rem);
  line-height: 1.1;
  color: #111111;
}

.image-section-text {
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 1.15vw, 1.1rem);
  line-height: 1.6;
  color: #333333;
}

.image-section-photo {
  width: 100%;
  height: auto;
  max-height: 60vh;
  object-fit: cover;
  border-radius: 0.75rem;
  display: block;
}

/* --- MOBILE : le texte passe au-dessus de l'image --- */
@media (max-width: 1023px) {
  .image-section {
    padding: 5rem 5vw 3rem;
    justify-content: center;
  }

  .image-section-block {
    grid-template-columns: 1fr;
    width: 100%;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .image-section-photo {
    max-height: 40vh;
  }
}
</style>