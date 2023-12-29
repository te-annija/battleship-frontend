/**
 * FILENAME: index.ts
 * DESCRIPTION: The router file that sets up the routes for the application, indicates used file for each route.
 * AUTHOR: Annija Karitone
 */

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import GamePage from '@/pages/GamePage.vue'
import LeaderboardPage from '@/pages/LeaderboardPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import RankManagement from '@/components/admin/RankManagement.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import HistoryPage from '@/pages/HistoryPage.vue'
import { useUserStore } from '@/stores/user'
import authService from '@/services/AuthService'
import { useToast } from 'vue-toastification'

const toast = useToast()

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
      path: '/leaderboard',
      name: 'leaderboard',
      meta: {
        requiresUser: true
      },
      component: LeaderboardPage
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        requiresGuest: true
      },
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        requiresGuest: true
      },
      component: RegisterPage
    },
    {
      path: '/settings',
      name: 'settings',
      meta: {
        requiresUser: true
      },
      component: SettingsPage
    },
    {
      path: '/user/:username',
      name: 'profile',
      meta: {
        requiresUser: true
      },
      component: ProfilePage
    },
    {
      path: '/history',
      name: 'history',
      meta: {
        requiresUser: true
      },
      component: HistoryPage
    },
    {
      path: '/admin',
      component: AdminPage,
      children: [
        {
          path: '',
          name: 'admin',
          component: AdminDashboard,
          meta: {
            title: 'Dashboard',
            requiresAdmin: true
          }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: UserManagement,
          meta: {
            title: 'User Management',
            requiresAdmin: true
          }
        },
        {
          path: 'ranks',
          name: 'admin-ranks',
          component: RankManagement,
          meta: {
            title: 'Rank Management',
            requiresAdmin: true
          }
        }
      ]
    }
  ]
})

/** Frontend middleware to check if user is allowed to enter the page. */
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (userStore.user) {
    /** Handle if registred user is still authorized to access resources. */
    try {
      await authService.authorizeUser()
    } catch (error: any) {
      userStore.user = null
      toast.error('You have been logged out!')
      return '/login'
    }

    /** Handle if registred user is not accessing guest pages. */
    const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
    if (requiresGuest) {
      return '/'
    }
  } else {
    /** Handle if guest user is not accessing registred user pages. */
    const requiresUser = to.matched.some((record) => record.meta.requiresUser)
    if (requiresUser) {
      toast.error('You need to be logged in to access this!')
      return '/login'
    }
  }

  /** Handle if user is authorized to access admin pages. */
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  if (requiresAdmin) {
    try {
      await authService.authorizeAdmin()
    } catch (error: any) {
      toast.error('You are not authorized to access admin panel.')
      return '/login'
    }
  }
})

export default router
