/**
 * FILENAME: WebsocketService.ts
 * AUTHOR: Annija Karitone
 */

import { type WebsocketMessage } from '@/types/WebSocketTypes'
import cookieService from './CookieService'
import { $bus } from '@/utils/GlobalEmit'

/**
 * Service to handle interaction with WebSocket for multiplayer connection.
 */
export class WebSocketService {
  private socket: WebSocket // Connection to the websocket

  constructor() {
    // Handle user session connection sync ID
    this.socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)

    // Bind the event listener functions to the class instance
    this.handleOpen = this.handleOpen.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleClose = this.handleClose.bind(this)

    // Add event listeners for Websocket events
    this.socket.addEventListener('open', this.handleOpen)
    this.socket.addEventListener('message', this.handleMessage)
    this.socket.addEventListener('close', this.handleClose)
  }

  /**
   * Sends a message to Websocket connection.
   * @param message The text that needs to be sent.
   */
  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message)
    } else {
      console.error('WebSocket is not open.')
    }
  }

  /**
   * Formats a message that will be sent out to the Websocket.
   * @param type The action to execute.
   * @param data The parameters of the action.
   * @returns
   */
  formatMessage(type: string, data: any = null): string {
    const message: WebsocketMessage = {
      type,
      data
    }
    return JSON.stringify(message)
  }

  /**
   * Manage actions on Websocket connection start.
   * @param event Data passed from a Websocket open event.
   */
  private handleOpen(event: Event) {
    console.log('Connected to server')
    $bus.emit('websocket-connected', event)
  }

  /**
   * Manage actions on Websocket connection recieve message.
   * @param event Data passed from a Websocket message event.
   */
  private handleMessage(event: MessageEvent) {
    const data: WebsocketMessage = JSON.parse(event.data)
    console.log('Received from server:', data)

    if (data.data && data.data.player && !cookieService.getUserId()) {
      cookieService.setUserId(data.data.player.id)
    }

    $bus.emit('websocket-message', data)
  }

  /**
   * Manage actions on Websocket connection end.
   * @param event Data passed from a Websocket close event.
   */
  private handleClose(event: CloseEvent) {
    console.log('Disconnected from server')
    $bus.emit('websocket-disconnected', event)
  }

  /**
   * End Websocket connection
   */
  close() {
    this.socket.close()
  }
}
