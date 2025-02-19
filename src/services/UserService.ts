/**
 * FILENAME: UserService.ts
 * AUTHOR: Annija Karitone
 */

import axios, { type AxiosResponse } from 'axios'
import authService from './AuthService'
import type { User } from '@/types/User'

const API_URL = `${import.meta.env.VITE_API_URL}/user`

/**
 * Service to handle interaction with backend to modify user data (CRUD).
 */
export class UserService {
  /**
   * Sends a request to get users accordingly to filters and sorting.
   * @param filters Filters in format 'field:value' seperated with ','.
   * @param sortBy The field to order users by.
   * @param sortOrder The sorting order (asc or desc).
   * @param paranoid False, if needed to retrieve soft-deleted users, false otherwise.
   * @returns Users that are filtered and sorted accordingly to parameters.
   */
  async getUsers(
    filters?: string,
    sortBy: string = 'id',
    sortOrder: string = 'asc',
    paranoid: boolean = true,
    limit: number = 0
  ): Promise<User[]> {
    const sortingParams = sortBy ? `sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
    const filterParams = `filterBy=${filters}`
    const paranoidParams = `paranoid=${paranoid}`
    const limitParams = `limit=${limit}`

    const queryParams = `${limitParams}&${paranoidParams}&${sortingParams}${
      sortingParams ? '&' : ''
    }${filterParams}`

    try {
      const response: AxiosResponse = await axios.get(`${API_URL}?${queryParams}`, {
        headers: authService.authHeader()
      })
      return response.data.users
    } catch (error: any) {
      throw new Error(error.response.data.message || error.statusMessage)
    }
  }

  /**
   * Sends a request to get a user by id.
   * @param userId The unique identifier of the user.
   * @returns The user data with specified id and message.
   */
  async getUserById(userId: string): Promise<AxiosResponse<User>> {
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}/${userId}`, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to get a user by username.
   * @param username The username of the user.
   * @returns The user data with specified username and message.
   */
  async getUserByUsername(username: string): Promise<AxiosResponse<User>> {
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}/username/${username}`, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to get a user by username.
   * @param userId The username of the user.
   * @returns The user data with specified username and message.
   */
  async getUserStatistics(userId: string): Promise<AxiosResponse<User>> {
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}/statistics/${userId}`, {
        headers: authService.authHeader()
      })
      return response.data.statistics
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to get user games.
   * @param userId The unique identifier of the user.
   * @param filters Filters in format 'field:value' seperated with ','.
   * @returns User gmaes that are filtered accordingly to parameters.
   */
  async getUserGames(userId: string, filters?: string): Promise<AxiosResponse<any>> {
    try {
      const filterParams = `filterBy=${filters}`
      const response: AxiosResponse = await axios.get(
        `${API_URL}/${userId}/games/?${filterParams}`,
        {
          headers: authService.authHeader()
        }
      )
      return response.data.games
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to save a new user (admin permisions only).
   * @param userData The user data to be saved.
   * @returns The created user object and message.
   */
  async createUser(userData: any): Promise<AxiosResponse<User>> {
    try {
      const response: AxiosResponse = await axios.post(API_URL, userData, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to update an user with given ID.
   * @param userData The user data to be updated.
   * @returns The updated user object and message.
   */
  async updateUser(userData: any): Promise<AxiosResponse<User>> {
    try {
      const { userId = -1, ...userDataUpdate } = { ...userData }
      const response: AxiosResponse = await axios.put(`${API_URL}/${userId}`, userDataUpdate, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to delete an user with given ID (soft-delete).
   * @param userId The unique identifier of the user to be deleted.
   * @returns Message if deletion was succcessful.
   */
  async deleteUser(userId: string): Promise<AxiosResponse<User>> {
    try {
      const response: AxiosResponse = await axios.delete(`${API_URL}/${userId}`, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to restore previously soft-deleted user.
   * @param userId The unique identifier of the user to be restored.
   * @returns The restored user object and message.
   */
  async restore(userId: string): Promise<AxiosResponse<User>> {
    try {
      const response: AxiosResponse = await axios.post(
        `${API_URL}/restore`,
        { id: userId },
        {
          headers: authService.authHeader()
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }
}

export default new UserService()
