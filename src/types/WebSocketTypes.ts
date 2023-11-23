/**
 * FILENAME: WebSocketTypes.ts
 * DESCRIPTION: Define used types for handling websocket connection
 * AUTHOR: Annija Karitone
 */

/** A message returned from the webscocket. */
export type WebsocketMessage = {
  /** Returned data type. */
  type: string

  /** Players game data. */
  data: any
}
