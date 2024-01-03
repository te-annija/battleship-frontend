<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The component renders a container where all unplaced ships are displayed.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="ships" :class="{ 'ships-inactive': !isEditMode }">
    <div class="ships__block" v-for="type in shipTypes" :key="type">
      <p>{{ type }}</p>
      <div class="ships__type">
        <div
          class="ships__ship"
          :class="{ 'ships__ship-vertical': getShipIsVertical(ship.shipId) && !ship.isOnBoard }"
          v-for="ship in getShipsByType(type)"
          :key="ship.shipId"
        >
          <div class="ships__cell" v-for="index in ship.size" v-bind:key="index">
            <game-ship
              class="ships__ship-real"
              v-if="index == 1 && !ship.isOnBoard"
              :ship="ship"
              :is-game-mode="isGameMode"
              :is-edit-mode="isEditMode"
              @toggleRotation="handleSetRotation"
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
  data() {
    return {
      shipsLocal: this.ships as ShipInterface[]
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
    },
    getShipIsVertical(shipId: string) {
      const ship = this.shipsLocal.find((ship) => ship.shipId === shipId)
      return ship && ship.position.isVertical ? true : false
    },
    handleSetRotation(shipId: string, isVertical: boolean) {
      const ship = this.shipsLocal.find((ship) => ship.shipId === shipId)

      if (ship) {
        ship.position.isVertical = isVertical
      }
    }
  }
})
</script>
<style lang="scss" scoped>
@import '../../assets/styles/_variables';

.ships {
  width: 225px;
  padding: 10px;

  &-inactive {
    opacity: 0.4;
  }

  &__ship {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: fit-content;
    border: dotted 1px $cl-text;

    &:not(.ships__ship-vertical) div:not(:first-child) {
      border-left: dotted 1px $cl-text;
    }

    &-vertical {
      flex-direction: column;

      div:not(:first-child) {
        border-top: dotted 1px $cl-text;
      }
    }

    &-real {
      background-color: $cl-bg-card;
      position: relative;
      top: -2px;
      left: -2px;
    }
  }

  &__type {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding-bottom: 10px;
  }

  &__cell {
    width: $cell-size;
    height: $cell-size;
  }
}

@media only screen and (max-width: 600px) {
  .ships {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &__cell {
      width: $cell-size-mobile;
      height: $cell-size-mobile;
    }

    &__block {
      min-width: 40%;
      margin: 0 auto;
    }

    &__type {
      gap: 5px;
      padding-bottom: 5px;
    }
  }
}
</style>
