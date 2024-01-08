<!-- 
  FILENAME: GameShip.vue
  DESCRIPTION: The component renders an ship that could be dragged on a gameboard.
  AUTHOR: Annija Karitone 
-->
<template>
  <div
    class="ship"
    :class="{
      'ship-vertical': isVertical,
      'ship-placed': ship.isOnBoard,
      'ship-sunk': ship.hits === ship.size,
      'ship-selected': isSelected
    }"
    :id="ship.shipId"
    :draggable="!isGameMode && isEditMode"
    @dragstart="emitSelectShip"
    @dragend="emitUnselectShip"
  >
    <div
      class="ship__cell"
      :class="{
        'ship__cell-vertical': isVertical,
        'ship__cell-horizontal': !isVertical
      }"
      v-bind:key="index"
      v-for="index in ship.size"
    />
    <div
      class="ship-rotate"
      v-if="isEditMode && !ship.isOnBoard && ship.size > 1"
      @click="handleToggleRotation"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { $bus } from '@/utils/GlobalEmit'

export default defineComponent({
  props: {
    ship: {
      type: Object,
      required: true
    },
    isGameMode: {
      type: Boolean as PropType<Boolean>,
      required: true
    },
    isEditMode: {
      type: Boolean as PropType<Boolean>,
      required: true
    }
  },
  data() {
    return {
      isSelected: false as Boolean,
      isVertical: this.ship.position.isVertical as Boolean
    }
  },
  mounted() {
    this.$emit('toggleRotation', this.ship.shipId, this.isVertical)
  },
  watch: {
    ship: {
      handler(ship, oldShip) {
        if (ship.shipId !== oldShip.shipId) {
          this.isVertical = ship.position.isVertical
        }
      },
      deep: true
    }
  },
  methods: {
    emitSelectShip(event: DragEvent) {
      if (event && event.dataTransfer) {
        event.dataTransfer.setData('shipId', this.ship.shipId)
      }

      $bus.emit('select-ship', {
        ...this.ship,
        position: { ...this.ship.position, isVertical: this.isVertical }
      })
      this.isSelected = true
    },
    emitUnselectShip() {
      $bus.emit('select-ship', null)
      this.isSelected = false
    },
    handleToggleRotation() {
      this.isVertical = !this.isVertical
      this.$emit('toggleRotation', this.ship.shipId, this.isVertical)
    }
  }
})
</script>
<style lang="scss" scoped>
@import '../../assets/styles/_variables';

.ship {
  display: flex;
  width: fit-content;
  border: 2px solid $cl-primary;
  position: relative;

  &[draggable='true'] {
    cursor: move;
  }

  &-vertical {
    flex-direction: column;
  }

  &-selected {
    background: transparentize(#b4b4ff, 0.4);
    transition: 0.1s;
    transform: translateX(-9999px);
  }

  &-placed {
    border: 1px solid $cl-primary;
    box-shadow: 0 0 0 1px $cl-primary;
  }

  &-sunk {
    border: 1.5px solid #f85149;
    box-shadow: 0 0 0 1px #f85149;
  }

  &__cell {
    width: $cell-size;
    height: $cell-size;
    border: 1px solid $cl-brdr-game;

    &-horizontal + &-horizontal {
      border-left: none;
    }

    &-vertical + &-vertical {
      border-top: none;
    }
  }

  &-rotate {
    width: 15px;
    height: 15px;
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    background: $bg-rotate no-repeat center center;
    background-size: 10px 10px;
  }
}

@media only screen and (max-width: 600px) {
  .ship {
    &__cell {
      width: $cell-size-mobile;
      height: $cell-size-mobile;
    }
  }
}
</style>
