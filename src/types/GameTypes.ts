/**
 * FILENAME: GameTypes.ts
 * DESCRIPTION: Define used types for handling game logic
 * AUTHOR: Annija Karitone
 */

/** Represents a player in the game. */
export type Player = {
  /** The unique identifier for the player. */
  id: string

  /** The public name of the player. */
  name: string

  /** The player's own gameboard. */
  gameboard?: Gameboard

  /** The results of the player's attacks on the enemy's gameboard. */
  enemyGameboard?: Gameboard

  /** True if player is ready to start the game. */
  isReady: boolean

  /** The gameroom id of player's current game. */
  gameRoomId?: string
}

/** Represents a gameboard for a player's game. */
export type Gameboard = {
  /** The row and column count of the gameboard in units. */
  size: number

  /** The minimum coordinate value. */
  coord_min: number

  /** The maximum coordinate value (size - 1). */
  coord_max: number

  /** A 2D grid containing board cells with the same rows and columns as size. */
  grid: BoardCell[][]

  /** All ships on the board. */
  ships: Ship[]
}

/** Represents an individual cell on the gameboard.*/
export type BoardCell = {
  /** The state of the cell (e.g., empty, hit, missed). */
  state: string

  /* The state of the cell  (e.g., invalid, valid) to show if current selected ship coordinates are valid. **/
  shipPlacementState?: string

  /** Reference to an occupying ship, or null if the cell is empty*/
  ship?: Ship
}

/** Represents battleship status. */
export type Ship = {
  /** The unique identifier for the ship. */
  id: string

  /** The name of the ship. */
  name: string

  /** The size of the battleship in units. */
  size: number

  /** The count of successful enemy attacks on the ship. */
  hits: number

  /** The position of the ship on the gameboard. */
  position: ShipPosition

  /** Indicates if the ship is already placed on board. */
  isOnBoard: boolean
}

/** Represents ship position on the grid. */
export type ShipPosition = {
  /** The row number where the ship is positioned. */
  row: number

  /** The column number where the ship is positioned. */
  col: number

  /** Indicates if the ship is oriented vertically or horizontally. */
  isVertical: boolean
}
