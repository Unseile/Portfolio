import { createRouter, createWebHistory } from 'vue-router'
import HorizontalScroll from '../components/HorizontalScroll.vue'
import { getProject } from '../data/projects.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HorizontalScroll },
    {
      path: '/projets/:slug',
      component: () => import('../views/ProjectPage.vue'),
      // Un projet inconnu ramène à l'accueil
      beforeEnter: (to) => (getProject(String(to.params.slug)) ? true : { path: '/' }),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  // Chaque nouvelle page repart du haut
  scrollBehavior: () => ({ top: 0 }),
})

export default router