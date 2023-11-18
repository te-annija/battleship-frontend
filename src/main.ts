// FILENAME: main.ts
// DESCRIPTION: The Vue App entry point.
// AUTHOR: Annija Karitone

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import Toast, { POSITION } from 'vue-toastification'

const app = createApp(App)

app.use(router)
app.use(VueClipboard)

app.use(Toast, {
  draggable: false,
  position: POSITION.BOTTOM_CENTER
})

app.mount('#app')
