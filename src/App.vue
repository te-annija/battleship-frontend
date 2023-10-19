<!-- 
  FILENAME: App.vue
  DESCRIPTION: The component serves as the main container for the app.
  AUTHOR: Annija Karitone
-->
<template>
  <main>
    <h1>Battleship Game</h1>
    <GameContainer />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameContainer from '@/components/game/GameContainer.vue'

export default defineComponent({
  components: {
    GameContainer
  }
})
</script>
