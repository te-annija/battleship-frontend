<!-- 
  FILENAME: App.vue
  DESCRIPTION: The component serves as the main container for the app.
  AUTHOR: Annija Karitone
-->
<template>
  <main>
    <h1>Battleship Game</h1>
    <main>
      <RouterView />
    </main>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import './assets/app.scss'

export default defineComponent({
  components: {
    RouterView
  }
})
</script>
