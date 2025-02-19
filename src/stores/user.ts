/**
 * FILENAME: user.ts
 * DESCRIPTION: Global state that stores and handles information about user.
 * AUTHOR: Annija Karitone
 */
import { defineStore } from 'pinia'
import { type User } from '@/types/User'
import AuthService from '@/services/AuthService'
import userService from '@/services/UserService'
import { useToast } from 'vue-toastification'

const toast = useToast()
export const useUserStore = defineStore('user', {
  persist: true,
  state: () => ({
    user: null as User | null
  }),
  actions: {
    /**
     * Handle request to update user data stored in state.
     */
    async fetchUserData() {
      try {
        if (this.user) {
          const data: any = await userService.getUserById(this.user.userId.toString())
          this.user = data.user
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    },
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
        this.$router.push({ path: '/login' })
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    /**
     * Handle request to register a new user and respond with results.
     * @param userData The data to register a new user.
     */
    async register(userData: any) {
      try {
        const data: any = await AuthService.register(userData)
        this.$router.push({ path: '/login' })
        toast.success(data.message)
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    /**
     * Handle request to modify current user data.
     * @param userData The data to update for the user model.
     */
    async update(userData: any) {
      try {
        const data: any = await userService.updateUser(userData)
        this.user = data.user
        toast.success(data.message)
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    /**
     * Handle request to deactivate current user (solf-delete).
     * @param userId The unique identifier of the user to deactivate.
     */
    async delete(userId: number) {
      try {
        const data: any = await userService.deleteUser(userId.toString())
        toast.success(data.message)
        await AuthService.logout()
        this.$router.push({ path: '/login' })
        this.user = null
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }
})
