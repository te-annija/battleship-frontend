/**
 * FILENAME: index.ts
 * DESCRIPTION: The router file that sets up the routes for the application, indicates used file for each route.
 * AUTHOR: Annija Karitone
 */

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    }
  ]
})

export default router
