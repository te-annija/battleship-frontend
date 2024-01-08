/**
 * FILENAME: RankService.ts
 * AUTHOR: Annija Karitone
 */

import axios, { type AxiosResponse } from 'axios'
import authService from './AuthService'
import type { Rank } from '@/types/Rank'

const API_URL = `${import.meta.env.VITE_API_URL}/rank`

/**
 * Service to handle interaction with backend to modify rank data (CRUD).
 */
export class RankService {
  /**
   * Sends a request to get ranks accordingly to filters and sorting.
   * @param filters Filters in format 'field:value' seperated with ','.
   * @param sortBy The field to order ranks by.
   * @param sortOrder The sorting order (asc or desc).
   * @param paranoid False, if needed to retrieve soft-deleted ranks, false otherwise.
   * @returns Ranks that are filtered and sorted accordingly to parameters.
   */
  async getRanks(
    filters?: string,
    sortBy: string = 'rankId',
    sortOrder: string = 'asc',
    paranoid: boolean = true
  ): Promise<Rank[]> {
    const sortingParams = sortBy ? `sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
    const filterParams = `filterBy=${filters}`
    const paranoidParams = `paranoid=${paranoid}`
    const queryParams = `${paranoidParams}&${sortingParams}${
      sortingParams ? '&' : ''
    }${filterParams}`

    try {
      const response: AxiosResponse = await axios.get(`${API_URL}?${queryParams}`, {
        headers: authService.authHeader()
      })
      return response.data.ranks
    } catch (error: any) {
      throw new Error(error.response.data.message || error.statusMessage)
    }
  }

  /**
   * Sends a request to get a rank by id.
   * @param rankId The unique identifier of the rank.
   * @returns The user data with specified id and message.
   */
  async getRankById(rankId: string): Promise<AxiosResponse<Rank>> {
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}/${rankId}`, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to save a new rank (admin permisions only).
   * @param rankData The rank data to be saved.
   * @returns The created rank object and message.
   */
  async createRank(rankData: any): Promise<AxiosResponse<Rank>> {
    try {
      const response: AxiosResponse = await axios.post(API_URL, rankData, {
        headers: { ...authService.authHeader(), 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to update a rank with given ID (admin permisions only).
   * @param rankId The identifier of the rank.
   * @param rankData The rank data to be updated.
   * @returns The updated rank object and message.
   */
  async updateRank(rankId: number, rankData: any): Promise<AxiosResponse<Rank>> {
    try {
      const response: AxiosResponse = await axios.put(`${API_URL}/${rankId}`, rankData, {
        headers: { ...authService.authHeader(), 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to delete a rank with given ID (soft-delete) (admin permisions only).
   * @param rankId The unique identifier of the rank to be deleted.
   * @returns Message if deletion was succcessful.
   */
  async deleteRank(rankId: string): Promise<AxiosResponse<Rank>> {
    try {
      const response: AxiosResponse = await axios.delete(`${API_URL}/${rankId}`, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }

  /**
   * Sends a request to restore previously soft-deleted rank.
   * @param rankId The unique identifier of the rank to be restored.
   * @returns The restored rank object and message.
   */
  async restoreRank(rankId: string): Promise<AxiosResponse<Rank>> {
    try {
      const response: AxiosResponse = await axios.post(
        `${API_URL}/restore`,
        { id: rankId },
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

export default new RankService()
