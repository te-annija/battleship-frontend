/**
 * FILENAME: GlobalEmit.ts
 * DESCRIPTION: Utility file that allows to emit global events that can be listened everywhere in the code.
 * AUTHOR: Annija Karitone
 */

import { ref, type Ref } from 'vue'
import { type EventMap, type Callback } from '@/types/GlobalEmitTypes'

// Create a reactive reference to store the EventMap
const eventBus: Ref<EventMap> = ref({})

/** Event bus object that allows emitting, subscribing to, and unsubscribing from events.*/
export const $bus = {
  /**
   * Emit an event and pass data to its associated callbacks.
   * @param event - The name of the event.
   * @param data - Data to pass to event callbacks.
   */
  emit(event: string, data: any) {
    if (eventBus.value[event]) {
      eventBus.value[event].forEach((callback) => callback(data))
    }
  },

  /**
   * Subscribe to an event by providing an event name and a callback function.
   * @param event - The name of the event to subscribe to.
   * @param callback - The callback function to execute when the event is emitted.
   */
  on(event: string, callback: Callback) {
    if (!eventBus.value[event]) {
      eventBus.value[event] = []
    }
    eventBus.value[event].push(callback)
  },

  /**
   * Unsubscribe from an event by providing an event name and a callback function.
   * @param event - The name of the event to unsubscribe from.
   * @param callback - The callback function to remove from the event's subscribers.
   */ off(event: string, callback: Callback) {
    if (eventBus.value[event]) {
      const index = eventBus.value[event].indexOf(callback)
      if (index !== -1) {
        eventBus.value[event].splice(index, 1)
      }
    }
  }
}
