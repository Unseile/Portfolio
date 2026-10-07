<script setup lang="ts">
withDefaults(
  defineProps<{
    background: string; // image plein écran
    email: string;
    linkedin: string;
    linkedinUrl: string;
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

      <div class="image-section-content">

        <div class="image-section-top">
          <a class="image-section-link" :href="`mailto:${email}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <span>{{ email }}</span>
          </a>

          <a class="image-section-link" :href="linkedinUrl" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
            </svg>
            <span>{{ linkedin }}</span>
          </a>
        </div>

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

.image-section-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 2rem;          /* espace vertical / horizontal entre les deux liens */
  font-family: var(--font-project-skill);
  font-size: 0.9rem;
}

.image-section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;                /* espace entre l'icône et le texte */
  color: #111111;
  text-decoration: none;
  transition: color 0.25s ease;
}

.image-section-link svg {
  width: 1.1rem;
  height: 1.1rem;
  flex: 0 0 auto;
}

.image-section-link:hover {
  color: #39803c;
}

.image-section-link:hover span {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.image-section-link:focus-visible {
  outline: 2px solid #39803c;
  outline-offset: 3px;
  border-radius: 4px;
}

/* Bloc : image + texte côte à côte, sans marge interne */
.image-section-block {
  position: relative;
  z-index: 1;
  width: min(40vw, 62rem);
  padding: 0; /* ← plus de marge interne sur le bloc */
  overflow: hidden; /* l'image suit les coins arrondis du bloc */
  background: rgb(255, 255, 255);
}

/* Texte : c'est lui qui porte les marges internes */
.image-section-content {
  align-self: center;
  padding: 2rem;
}

.image-section-title {
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
  font-family: var(--font-title);
  font-size: 2.8rem;
  color: #39803C;
}

.image-section-text {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.6;
  color: #000000;
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
  border: 1px solid #FFA0A0;
  border-radius: 999px;
  background: #FFA0A0;
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
  background: #d67878;
  color: #ffffff;
  border-color: #d67878;
}

/* Bouton secondaire : contour seul */
.cv-button--ghost {
  background: transparent;
  color: #000000;
  border: 1px solid #39803C;
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
@@media (max-width: 1023px) {
  .image-section {
    min-height: 100vh;
    min-height: 100svh;
    padding: 5rem 5vw 3rem;
    justify-content: center;
  }

  .image-section-block {
    width: 100%;
  }

  .image-section-content {
    padding: 1.5rem;
  }

  .image-section-title {
    font-size: 2.2rem;
  }

  /* E-mail et LinkedIn l'un sous l'autre (si tu as ajouté les icônes cliquables) */
  .image-section-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .image-section-link span {
    overflow-wrap: anywhere;   /* une longue adresse e-mail ne déborde pas */
  }

  .image-section-actions .cv-button {
    flex: 1 1 auto;            /* les deux boutons du CV se partagent la largeur */
    text-align: center;
  }
}media (max-width: 1023px) {
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
