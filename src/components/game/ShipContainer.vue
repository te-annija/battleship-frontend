<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The component renders a container where all unplaced ships are displayed.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="ship__container">
    <game-ship v-for="ship in activeShips" :key="ship.id" :ship="ship" :is-game-mode="isGameMode" />
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import GameShip from './GameShip.vue'
import { type Ship as ShipInterface } from '@/types/GameTypes'

export default defineComponent({
  components: {
    GameShip
  },
  props: {
    ships: {
      type: Array as PropType<ShipInterface[]>,
      required: true
    },
    isGameMode: {
      type: Boolean as PropType<Boolean>,
      required: true
    }
  },
  computed: {
    activeShips() {
      return this.ships.filter((ship) => !ship.isOnBoard)
    }
  }
})
</script>
<style lang="scss" scoped>
.ship__container {
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
