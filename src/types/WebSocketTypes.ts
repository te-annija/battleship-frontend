/**
 * FILENAME: WebSocketTypes.ts
 * DESCRIPTION: Define used types for handling websocket connection
 * AUTHOR: Annija Karitone
 */

/** Generic MessageHandler method to be called when a Websocket message is received. */
export type MessageHandler = (message: WebsocketMessage) => void

/** A message returned from the webscocket. */
export type WebsocketMessage = {
  /** Returned data type. */
  type: string

  /** Players game data. */
  data: any
}
