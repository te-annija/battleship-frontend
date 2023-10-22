/**
 * FILENAME: CookieService.ts
 * AUTHOR: Annija Karitone
 */

import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

/**
 * Service to handle data stored in the browser cookies.
 */
export default class CookieService {
  private readonly userIdKey = 'uid'

  /**
   * Get user ID stored in a cookie.
   * @returns The user unique identifier.
   */
  getUserId(): string | null {
    return cookies.get(this.userIdKey)
  }

  /**
   * Stores user ID in a cookie for 30 days.
   * @param userId The unique identifier of the user.
   */
  setUserId(userId: string): void {
    cookies.set(this.userIdKey, userId, '30d')
  }

  /**
   * Remove user ID from the cookie.
   */
  removeUserId(): void {
    cookies.remove(this.userIdKey)
  }
}
