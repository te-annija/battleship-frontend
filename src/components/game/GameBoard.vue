<!-- 
  FILENAME: GameBoard.vue
  DESCRIPTION: The component renders a game 2D grid to the user.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="gameboard" v-if="gameboard">
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
        :cell="cell"
        :row="rowIndex"
        :column="colIndex"
        :class="{ 'brdr-top-none': rowIndex > 0 }"
        :is-game-mode="isGameMode"
        @click="$emit('attackCell', rowIndex, colIndex)"
        @dragover.prevent
        @dragover="!cell.ship && $emit('dragOver', rowIndex, colIndex)"
        @dragleave="!cell.ship && $emit('dragLeave', rowIndex, colIndex)"
        @drop="$emit('dropShip', rowIndex, colIndex)"
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
}
</style>
