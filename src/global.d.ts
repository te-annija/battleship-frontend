import { Router } from 'vue-router'

export {}

declare global {}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router
  }
}
