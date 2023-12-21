<!-- 
  FILENAME: GameBoard.vue
  DESCRIPTION: The component renders an indivudual cell of a gameboard grid.
  AUTHOR: Annija Karitone 
-->
<template>
  <div
    class="gameboard__cell"
    :class="{
      'gameboard__cell-ship':
        (cell && cell.ship) || (cell && cell.state === 'ship' && !cell.shipPlacementState),
      'gameboard__cell-adjacent':
        !isGameMode && cell && cell.state === 'adjacent' && !cell.shipPlacementState,
      'gameboard__cell-hit': cell && cell.state === 'hit',
      'gameboard__cell-miss': cell && cell.state === 'miss',
      'gameboard__cell-valid': !isGameMode && cell && cell.shipPlacementState == 'valid',
      'gameboard__cell-invalid': !isGameMode && cell && cell.shipPlacementState == 'invalid',
      'gameboard__cell-attack':
        isGameMode && isPlayerTurn && !isPlayerGameBoard && cell && cell.state === 'empty',
      'gameboard__cell-ghost': cell && cell.state === 'ghost-empty'
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
      :is-edit-mode="isEditMode"
      @dragover="hoveredShip = true"
      @dragleave="hoveredShip = false"
      @drop="hoveredShip = false"
    />
    <span class="circle" />
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import GameShip from './GameShip.vue'
import { type GameboardCell } from '@/types/GameTypes'

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
      type: Object as PropType<GameboardCell>,
      default: null
    },
    isGameMode: {
      type: Boolean as PropType<Boolean>,
      required: true
    },
    isEditMode: {
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
@import '../../assets/styles/_variables';

.gameboard__cell {
  background: #adc3cc4d;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid $cl-brdr-game;

  & + & {
    border-left: none;
  }

  &-ship {
    border: none;
    background: transparentize(#b4b4ff, 0.6);
  }

  &-adjacent {
    background: transparentize(#628395, 0.7);
  }

  &-valid {
    background: transparentize(#68a357, 0.3);
  }

  &-invalid {
    background: transparentize(#ba1200, 0.3);
  }

  &-hit {
    border: none;
    background-color: transparentize(#eca7a2, 0.6);
    &:before {
      content: 'X';
      font-size: 35px;
      font-variant: small-caps;
      color: $cl-red;
    }
  }

  &-ghost {
    border: 1px dashed $cl-primary !important;
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
