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
  private readonly themeKey = 'theme'

  /**
   * Get user ID stored in a cookie.
   * @returns The user unique identifier.
   */
  getUserId(): string | null {
    return cookies.get(this.userIdKey)
  }

  /**
   * Get theme type stored in a cookie.
   * @returns The theme type (eg., light, dark).
   */
  getTheme(): string | null {
    return cookies.get(this.themeKey)
  }

  /**
   * Stores user ID in a cookie for 30 days.
   * @param userId The unique identifier of the user.
   */
  setUserId(userId: string): void {
    cookies.set(this.userIdKey, userId, '30d')
  }

  /**
   * Stores theme in a cookie for 30 days.
   * @param userId The theme of the user.
   */
  setTheme(theme: string): void {
    cookies.set(this.themeKey, theme, '30d')
  }

  /**
   * Remove user ID from the cookie.
   */
  removeUserId(): void {
    cookies.remove(this.userIdKey)
  }

  /**
   * Remove theme from the cookie.
   */
  removeTheme(): void {
    cookies.remove(this.themeKey)
  }
}
