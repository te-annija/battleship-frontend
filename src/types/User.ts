/**
 * FILENAME: User.ts
 * DESCRIPTION: Define used type for handling user information.
 * AUTHOR: Annija Karitone
 */
/** Reprensents the registered user general information. */
export type User = {
  /** Unique identifier of the user. */
  id: number

  /** Unique username. User is identified using this string. */
  username: string

  /** Date and time when the user's block will be lifted. */
  blockExpiresAt: string

  /** True if user is a administrator, false otherwise. Do not use for auth. */
  isAdmin: boolean

  createdAt: string
  updatedAt: string
  deletedAt: string

  [key: string]: any // Access user properties using key notation.
}
