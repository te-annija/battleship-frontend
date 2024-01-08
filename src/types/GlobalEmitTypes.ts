/**
 * FILENAME: GlobalEmitTypes.ts
 * DESCRIPTION: Define used types for handling global event emitting.
 * AUTHOR: Annija Karitone
 */

/** Represents a function to be called as action on emit. */
export type Callback = (data: any) => void

/** Represents the data structure (dictionary) for storing the events. */
export type EventMap = {
  [key: string]: Callback[]
}
