<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The component renders a container where all unplaced ships are displayed.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="ship__container">
    <div v-for="type in shipTypes" :key="type">
      <p>{{ type }}</p>
      <div class="ship__container-type">
        <div
          class="ship__container-ship"
          :class="{ 'ship__container-ship-vertical': ship.position.isVertical && !ship.isOnBoard }"
          v-for="ship in getShipsByType(type)"
          :key="ship.id"
        >
          <div
            class="ship__container-cell"
            :class="{ 'ship__container-cell-placed': ship.isOnBoard }"
            v-for="index in ship.size"
            v-bind:key="index"
          >
            <game-ship
              v-if="index == 1 && !ship.isOnBoard"
              :ship="ship"
              :is-game-mode="isGameMode"
              :is-edit-mode="isEditMode"
            />
          </div>
        </div>
      </div>
    </div>
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
    },
    isEditMode: {
      type: Boolean as PropType<Boolean>,
      required: true
    }
  },
  computed: {
    shipTypes() {
      return Array.from(new Set(this.ships.map((ship) => ship.name)))
    }
  },
  methods: {
    getShipsByType(type: string) {
      return this.ships.filter((ship) => ship.name === type)
    }
  }
})
</script>
<style lang="scss" scoped>
@import '../../assets/styles/_variables';

.ship__container {
  width: 225px;
  padding: 10px;

  &-ship {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-vertical {
      flex-direction: column;
    }
  }

  &-type {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding-bottom: 10px;
  }

  &-cell {
    width: 30px;
    height: 30px;

    &-placed {
      border: dotted 1px $cl-text;
    }

    & + & {
      border-left: none;
    }
  }
}
</style>
