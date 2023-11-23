/**
 * FILENAME: user.ts
 * DESCRIPTION: Global state that stores and handles information about user.
 * AUTHOR: Annija Karitone
 */
import { defineStore } from 'pinia'
import { type User } from '@/types/User'
import AuthService from '@/services/auth.service'
import { useToast } from 'vue-toastification'

const toast = useToast()
export const useUserStore = defineStore('user', {
  persist: true,
  state: () => ({
    user: null as User | null
  }),
  actions: {
    /**
     * Handle request to login user and save data in user global state.
     * @param username The username of the user.
     * @param password The password of the user.
     */
    async login(username: string, password: string) {
      try {
        const data: any = await AuthService.login(username, password)
        this.user = data.user
        toast.success(data.message)
        this.$router.push({ path: '/' })
      } catch (error: any) {
        console.log(error)
        toast.error(error.message)
      }
    },
    /**
     * Handle request to logout user and remove user global state.
     */
    async logout() {
      try {
        await AuthService.logout()
        this.user = null
        toast.success('Logged out Successfully!')
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    /**
     * Handle request to register a new user and respond with results.
     * @param username The unique username of the user.
     * @param password The password of the user.
     * @param confirm The password confirmation. Should match the password for valid registration.
     */
    async register(username: string, password: string, confirm: string) {
      try {
        const data: any = await AuthService.register(username, password, confirm)
        this.$router.push({ path: '/login' })
        toast.success(data.message)
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }
})
