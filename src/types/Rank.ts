/**
 * FILENAME: Rank.ts
 * DESCRIPTION: Define used type for handling rank information.
 * AUTHOR: Annija Karitone
 */
/** Reprensents the rank information. */
export type Rank = {
  /** Unique identifier of the rank. */
  id: number

  /** The title of the rank. */
  title: string

  /** The path to the rank icon. */
  icon: string

  /** Difficulty level of the rank. Value between 1 and 7. */
  difficulty: number

  /** Minimum points required to achieve this rank. */
  minimumPoints: number

  createdAt: string
  updatedAt: string
  deletedAt: string

  [key: string]: any // Access rank properties using key notation.
}
