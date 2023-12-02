/**
 * FILENAME: auth.service.ts
 * AUTHOR: Annija Karitone
 */

import axios, { type AxiosResponse } from 'axios'
import cookieService from './cookie.service'

const API_URL = `${import.meta.env.VITE_API_URL}/auth`

/**
 * Service to handle interaction with backend to authorize user.
 */
export class AuthService {
  /**
   * Sends a request to authentificate user.
   * Saves JWT token in a cookie for authorization.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns The response data containing user information.
   */
  async login(username: string, password: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password
      })

      if (response.data.token) {
        cookieService.setToken(response.data.token)
      }
      return response.data
    } catch (error: any) {
      const message: string =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.statusMessage
      throw new Error(message)
    }
  }

  /**
   * Removes user JWT token from a cookie.
   */
  logout() {
    try {
      cookieService.removeToken()
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  /**
   * Sends a request to save a new user.
   * @param username The unique username of the user.
   * @param password The password of the user.
   * @param confirm The password confirmation. Should match the password for valid registration.
   * @returns The response data containing success message.
   */
  async register(username: string, password: string, confirm: string): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.post(`${API_URL}/register`, {
        username: username,
        password: password,
        confirm: confirm
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.statusMessage)
    }
  }

  /**
   * Validates if user is an admin.
   * @returns The response data cantaining if user is admin.
   */
  async authorizeAdmin(): Promise<AxiosResponse<any>> {
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}/admin`, {
        headers: this.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Validates if user is an user and is not blocked.
   * @returns The response data cantaining if user is authentificated.
   */
  async authorizeUser(): Promise<AxiosResponse<any>> {
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}/`, {
        headers: this.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Helper method to add a valid authorization header to the request.
   * @returns Authorization header containing JWT token.
   */
  authHeader() {
    const token = cookieService.getToken()

    console.log(token)

    if (token) {
      return { Authorization: 'Bearer ' + token }
    } else {
      return {}
    }
  }
}

export default new AuthService()
