<!-- 
  FILENAME: HomePage.vue
  DESCRIPTION: The component serves as the main container for home page in the route '/'.
  AUTHOR: Annija Karitone
-->
<template>
  <GameContainer />
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
