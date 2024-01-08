// FILENAME: main.ts
// DESCRIPTION: The Vue App entry point.
// AUTHOR: Annija Karitone

import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { plugin, defaultConfig } from '@formkit/vue'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import Toast, { POSITION } from 'vue-toastification'

const app = createApp(App)

const pinia = createPinia()
pinia.use(({ store }) => {
  store.$router = markRaw(router)
})
pinia.use(piniaPluginPersistedState)
app.use(pinia)

app.use(Toast, {
  draggable: false,
  position: POSITION.TOP_RIGHT
})

app.use(router)
app.use(VueClipboard)
app.use(plugin, defaultConfig)

app.mount('#app')
