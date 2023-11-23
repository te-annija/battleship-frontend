/**
 * FILENAME: index.ts
 * DESCRIPTION: The router file that sets up the routes for the application, indicates used file for each route.
 * AUTHOR: Annija Karitone
 */

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import GamePage from '@/pages/GamePage.vue'
import TournamentPage from '@/pages/TournamentPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/game',
      name: 'game',
      component: GamePage
    },
    {
      path: '/tournaments',
      name: 'tournaments',
      component: TournamentPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    }
  ]
})

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register']
  const authNotRequired = publicPages.includes(to.path)
  const userStore = useUserStore()

  if (authNotRequired && userStore.user) {
    return '/'
  }
})

export default router
