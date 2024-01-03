/**
 * FILENAME: User.ts
 * DESCRIPTION: Define used type for handling user information.
 * AUTHOR: Annija Karitone
 */

import type { Rank } from './Rank'

/** Reprensents the registered user general information. */
export type User = {
  /** Unique identifier of the user. */
  userId: number

  /** Unique username. User is identified using this string. */
  username: string

  /** Date and time when the user's block will be lifted. */
  blockExpiresAt: string

  /** True if user is a administrator, false otherwise. Do not use for auth. */
  role: boolean

  /** Total point count of the user. */
  points: number

  /** Rank of the user. */
  rank: Rank

  statistics?: any

  createdAt: string
  updatedAt: string
  deletedAt: string

  [key: string]: any // Access user properties using key notation.
}
