<!-- 
  FILENAME: GameBoard.vue
  DESCRIPTION: The component renders a game 2D grid to the user.
  AUTHOR: Annija Karitone 
-->
<template>
  <div
    v-if="gameboard"
    class="gameboard"
    :class="{
      'gameboard-overlay':
        isGameMode && ((isPlayerTurn && isPlayerGameBoard) || (!isPlayerTurn && !isPlayerGameBoard))
    }"
  >
    <div class="gameboard__header">
      <div v-for="(col, colIndex) in gameboard.size" :key="colIndex" class="gameboard__header-cell">
        {{ String.fromCharCode(65 + colIndex) }}
      </div>
    </div>
    <div v-for="(row, rowIndex) in gameboard.grid" :key="rowIndex" class="gameboard__row">
      <div class="gameboard__header-cell">{{ rowIndex + 1 }}</div>
      <game-board-cell
        v-for="(cell, colIndex) in row"
        :key="rowIndex + '' + colIndex"
        :class="{ 'brdr-top-none': rowIndex > 0 }"
        :cell="cell"
        :row="rowIndex"
        :column="colIndex"
        :is-game-mode="isGameMode"
        :is-player-turn="isPlayerTurn"
        :is-player-game-board="isPlayerGameBoard"
        @click="cell.state == 'empty' && $emit('attackCell', rowIndex, colIndex)"
        @dragover.prevent
        @dragover="!cell.ship && $emit('dragOver', rowIndex, colIndex)"
        @dragleave="!cell.ship && $emit('dragLeave', rowIndex, colIndex)"
        @drop="handleDrop(rowIndex, colIndex, cell.shipPlacementState == 'valid')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import GameBoardCell from './GameBoardCell.vue'
import { type Gameboard } from '@/types/GameTypes'

export default defineComponent({
  components: {
    GameBoardCell
  },
  props: {
    gameboard: {
      type: Object as PropType<Gameboard>,
      required: true
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
  },
  methods: {
    handleDrop(rowIndex: number, colIndex: number, canDropShip: boolean) {
      if (canDropShip) {
        this.$emit('dropShip', rowIndex, colIndex)
      } else {
        this.$emit('dragLeave', rowIndex, colIndex)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.gameboard {
  &__row,
  &__header {
    display: flex;
  }

  &__header {
    margin-left: 30px;

    &-cell {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &-overlay {
    opacity: 0.4;
  }
}
</style>
