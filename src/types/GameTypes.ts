/**
 * FILENAME: GameTypes.ts
 * DESCRIPTION: Define used types for handling game logic
 * AUTHOR: Annija Karitone
 */

/** Represents a player in the game. */
export type Player = {
  /** The unique identifier for the player. */
  playerId: string

  /** The public name of the player. */
  username: string

  /** Indicates if player is ready to start the game in a session. */
  isReady: boolean

  /** The id of the game session where player is currently playing. */
  gameSessionId?: string
}

/** Represents a gameboard for a player's game. */
export type Gameboard = {
  /** The row and column count of the gameboard in units. */
  size: number

  /** A 2D grid containing board cells with the same rows and columns as size. */
  grid: GameboardCell[][]

  /** All ships on the board. */
  ships: Ship[]

  /** Last opponent attack coordinates on the gameboard. */
  lastAttack?: { row: number; col: number }
}

/** Represents an individual cell on the gameboard.*/
export type GameboardCell = {
  gameboardCellId: number

  /** The state of the cell (e.g., empty, hit, missed). */
  state: string

  /* The state of the cell  (e.g., invalid, valid) to show if current selected ship coordinates are valid. **/
  shipPlacementState?: string

  /** Reference to an occupying ship, or null if the cell is empty*/
  ship?: Ship

  /** The number of adjacent ships to the cell. */
  adjacentCount: number

  /** Inticates if cell belongs to player or attack gameboard. */
  origin?: string

  /** The datetime of the attack on the cell. */
  updatedAt: string
}

/** Represents battleship status. */
export type Ship = {
  /** The unique identifier for the ship. */
  shipId: string

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

/** Game container status and view. */
export enum GameStatus {
  Prepare,
  Waiting,
  WaitingActive,
  Game,
  GameEnded
}
