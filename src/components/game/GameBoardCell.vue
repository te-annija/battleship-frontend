<!-- 
  FILENAME: GameBoard.vue
  DESCRIPTION: The component renders an indivudual cell of a gameboard grid.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="gameboard__cell"></div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type BoardCell } from '@/types/GameTypes'

export default defineComponent({
  props: {
    cell: {
      type: Object as PropType<BoardCell>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.gameboard__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #d1bfbf;

  & + .gameboard__cell {
    border-left: none;
  }
}
</style>
