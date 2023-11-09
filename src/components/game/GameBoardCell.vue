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
      'gameboard__cell-invalid': !isGameMode && cell && cell.shipPlacementState == 'invalid',
      'gameboard__cell-attack':
        isGameMode && isPlayerTurn && !isPlayerGameBoard && cell && cell.state === 'empty'
    }"
  >
    <game-ship
      v-if="
        cell && cell.ship && cell.ship.position.row === row && cell.ship.position.col === column
      "
      class="gameboard__ship"
      :class="{ 'gameboard__cell-invalid': hoveredShip }"
      :ship="cell.ship"
      :is-game-mode="isGameMode"
      @dragover="hoveredShip = true"
      @dragleave="hoveredShip = false"
      @drop="hoveredShip = false"
    />
    <span class="circle"></span>
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
    },
    isPlayerTurn: {
      type: Boolean as PropType<Boolean>,
      required: true
    },
    isPlayerGameBoard: {
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

  & + & {
    border-left: none;
  }

  &-ship {
    background: transparentize(#b4b4ff, 0.6);
  }

  &-adjacent {
    background: transparentize(#f5f2f2, 0.2);
  }

  &-valid {
    background: transparentize(#68a357, 0.6);
  }

  &-invalid {
    background: transparentize(#ba1200, 0.6);
  }

  &-hit {
    background-color: transparentize(#eca7a2, 0.6);
    &:before,
    &:after {
      content: '';
      height: 40px;
      width: 1px;
      background-color: #ff0000;
    }

    &:before {
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
    }
  }

  &-miss {
    background-color: transparentize(#dfdfdf, 0.6);

    .circle {
      width: 4px;
      height: 4px;
      background-color: #adadad;
      border-radius: 50%;
    }
  }

  &-attack {
    cursor: pointer;
    z-index: 5;

    &:hover {
      border: 1px solid #68a357 !important;
      box-shadow: 0 0 0 1.5px #68a357;
      background: transparentize(#68a357, 0.9);
    }
  }
}
.gameboard__ship {
  position: absolute;
  z-index: 5;
  top: -1.4px;
  left: -1.4px;
}
</style>
