// FILENAME: main.ts
// DESCRIPTION: The Vue App entry point.
// AUTHOR: Annija Karitone

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
