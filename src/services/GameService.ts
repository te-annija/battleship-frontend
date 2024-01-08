/**
 * FILENAME: GameService.ts
 * AUTHOR: Annija Karitone
 */

import axios, { type AxiosResponse } from 'axios'
import authService from './AuthService'

const API_URL = `${import.meta.env.VITE_API_URL}/game` // Replace 'game' with the correct endpoint for games

/**
 * Service to handle interaction with backend to modify game data (CRUD).
 */
export class GameService {
  /**
   * Sends a request to get games accordingly to filters and sorting.
   * @param filters Filters in format 'field:value' separated with ','.
   * @param sortBy The field to order games by.
   * @param sortOrder The sorting order (asc or desc).
   * @param paranoid False, if needed to retrieve soft-deleted games, false otherwise.
   * @returns Games that are filtered and sorted accordingly to parameters.
   */
  async getGames(
    filters?: string,
    sortBy: string = 'id',
    sortOrder: string = 'asc',
    paranoid: boolean = true
  ): Promise<any[]> {
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
      return response.data.games
    } catch (error: any) {
      throw new Error(error.response.data.message || error.statusMessage)
    }
  }

  /**
   * Sends a request to get a game by id.
   * @param gameId The unique identifier of the game.
   * @returns The game data with specified id and message.
   */
  async getGameById(gameId: string): Promise<AxiosResponse<any>> {
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}/${gameId}`, {
        headers: authService.authHeader()
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message || error.response.data || error.statusMessage)
    }
  }
}

export default new GameService()
