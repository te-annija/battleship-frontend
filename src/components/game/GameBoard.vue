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
        (!isGameMode && !isEditMode && !isReplayMode) ||
        (isGameMode &&
          ((isPlayerTurn && isPlayerGameBoard) || (!isPlayerTurn && !isPlayerGameBoard)))
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
        :is-edit-mode="isEditMode"
        :is-replay-mode="isReplayMode"
        :is-player-turn="isPlayerTurn"
        :is-player-game-board="isPlayerGameBoard"
        @click="cell.state == 'empty' && isPlayerTurn && $emit('attackCell', rowIndex, colIndex)"
        @dragover.prevent
        @dragover="handleDragOverCell(rowIndex, colIndex, cell.ship)"
        @dragleave="handleDragLeaveCell(rowIndex, colIndex, cell.ship)"
        @drop="handleDrop(rowIndex, colIndex)"
      />
    </div>
    <p class="opacity text-center">{{ isPlayerGameBoard ? 'Your' : 'Attack' }} grid</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import GameBoardCell from './GameBoardCell.vue'
import { type Gameboard, type Ship } from '@/types/GameTypes'
import { $bus } from '@/utils/GlobalEmit'

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
      default: false
    },
    isEditMode: {
      type: Boolean as PropType<Boolean>,
      default: false
    },
    isReplayMode: {
      type: Boolean as PropType<Boolean>,
      default: false
    },
    isPlayerTurn: {
      type: Boolean as PropType<Boolean>,
      default: false
    },
    isPlayerGameBoard: {
      type: Boolean as PropType<Boolean>,
      required: true
    }
  },
  data() {
    return {
      selectedShip: null as Ship | null
    }
  },
  mounted() {
    $bus.on('select-ship', this.handleSelectShip)
  },
  methods: {
    handleSelectShip(ship: Ship) {
      this.selectedShip = ship
    },
    handleDrop(rowIndex: number, colIndex: number) {
      if (this.selectedShip) {
        this.$emit('dropShip', this.selectedShip, rowIndex, colIndex)
      }
      this.handleDragLeaveCell(rowIndex, colIndex)
    },
    handleDragOverCell(rowIndex: number, colIndex: number, ship?: Ship) {
      if (!ship || (this.selectedShip && ship && this.selectedShip.id === ship.id)) {
        this.dragShip(rowIndex, colIndex, true)
      }
    },
    handleDragLeaveCell(rowIndex: number, colIndex: number, ship?: Ship) {
      if (!ship || (this.selectedShip && ship && this.selectedShip.id === ship.id)) {
        this.dragShip(rowIndex, colIndex, false)
      }
    },
    dragShip(row: number, col: number, isDragOver: boolean) {
      const ship = this.selectedShip

      if (!ship || !this.gameboard) return

      let cells = []
      let isValid = true

      for (let i = 0; i < ship.size; i++) {
        const rowIndex = ship.position.isVertical ? row + i : row
        const colIndex = ship.position.isVertical ? col : col + i

        if (!this.isValidCoordinates(rowIndex, colIndex)) {
          isValid = false
          break
        }
        const cell = this.gameboard.grid[rowIndex][colIndex]
        cells.push(cell)
        isValid = isValid && cell.state !== 'ship' && cell.state !== 'adjacent'
      }

      const shipPlacementState = isDragOver ? (isValid ? 'valid' : 'invalid') : undefined
      for (let cell of cells) {
        cell.shipPlacementState = shipPlacementState
      }
    },
    isValidCoordinates(rowIndex: number, colIndex: number) {
      if (!this.gameboard) return false
      const boardSize: number = this.gameboard.size
      return rowIndex < boardSize && colIndex < boardSize && rowIndex >= 0 && colIndex >= 0
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
      font-size: 14px;
    }
  }

  &-overlay {
    opacity: 0.4;
  }
}
</style>
