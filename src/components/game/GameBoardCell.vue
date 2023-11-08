<!-- 
  FILENAME: GameBoard.vue
  DESCRIPTION: The component renders an indivudual cell of a gameboard grid.
  AUTHOR: Annija Karitone 
-->
<template>
  <div
    class="gameboard__cell"
    :class="{
      'gameboard__cell-ship': cell && cell.state === 'ship' && !cell.shipPlacementState,
      'gameboard__cell-adjacent':
        !isGameMode && cell && cell.state === 'adjacent' && !cell.shipPlacementState,
      'gameboard__cell-hit': cell && cell.state === 'hit',
      'gameboard__cell-miss': cell && cell.state === 'miss',
      'gameboard__cell-valid': !isGameMode && cell && cell.shipPlacementState == 'valid',
      'gameboard__cell-invalid': !isGameMode && cell && cell.shipPlacementState == 'invalid'
    }"
  >
    <game-ship
      class="gameboard__ship"
      v-if="
        cell && cell.ship && cell.ship.position.row === row && cell.ship.position.col === column
      "
      :ship="cell.ship"
      :is-game-mode="isGameMode"
      :class="{ 'gameboard__cell-invalid': hoveredShip }"
      @dragover="hoveredShip = true"
      @dragleave="hoveredShip = false"
      @drop="hoveredShip = false"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import GameShip from './GameShip.vue'
import { type BoardCell } from '@/types/GameTypes'

export default defineComponent({
  components: {
    GameShip
  },
  data() {
    return {
      hoveredShip: false
    }
  },
  props: {
    row: {
      type: Number,
      required: true
    },
    column: {
      type: Number,
      required: true
    },
    cell: {
      type: Object as PropType<BoardCell>,
      default: null
    },
    isGameMode: {
      type: Boolean as PropType<Boolean>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.gameboard__cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #d1bfbf;

  & + .gameboard__cell {
    border-left: none;
  }

  &-ship {
    background: #b4b4ff;
  }

  &-adjacent {
    background: #f5f2f2;
  }
  &-valid {
    background: #68a357;
    opacity: 0.7;
  }
  &-invalid {
    background: #ba1200;
    opacity: 0.7;
  }

  &-hit {
    background-color: #eca7a2;
  }

  &-miss {
    background-color: #dfdfdf;
    background-image: radial-gradient(rgba(217, 217, 217, 0.5) 4px, transparent 0);
  }
}
.gameboard__ship {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
}
</style>
