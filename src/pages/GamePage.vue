<!-- 
  FILENAME: GamePage.vue
  DESCRIPTION: The component serves as the main container for game page in the route '/game'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="game-page">
    <GameContainer />
  </div>
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
