<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The main component serves as the main container for the battleship game.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="game" v-if="player">
    <h2>Hello {{ player.id }}</h2>
    <div class="game__container">
      <game-board
        :gameboard="player.gameboard"
        @dropShip="handleDropShip"
        @dragOver="handleDragOverCell"
        @dragLeave="handleDragLeaveCell"
      />
      <ship-container :ships="player.gameboard.ships" @dragover.prevent @drop="handleRemoveShip" />
      <div class="game__actions">
        <button @click="sendSimpleAction('randomize-ships')">Randomize</button>
        <button @click="sendSimpleAction('reset-ships')">Reset</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WebSocketService from '@/services/WebSocketService'
import GameBoard from './GameBoard.vue'
import ShipContainer from './ShipContainer.vue'
import { type WebsocketMessage } from '@/types/WebSocketTypes'
import { type Player, type Ship } from '@/types/GameTypes'
import { $bus } from '@/utils/GlobalEmit'

export default defineComponent({
  data() {
    return {
      socketService: null as WebSocketService | null,
      player: null as Player | null,
      selectedShip: null as Ship | null
    }
  },
  components: {
    GameBoard,
    ShipContainer
  },
  mounted() {
    this.socketService = new WebSocketService()
    this.socketService.addMessageHandler(this.handleMessage)

    $bus.on('select-ship', this.handleSelectShip)
    $bus.on('toggle-ship-rotation', this.handleToggleShipRotation)
  },
  beforeUnmount() {
    if (this.socketService) {
      this.socketService.close()
    }
    $bus.off('select-ship', this.handleSelectShip)
    $bus.off('toggle-ship-rotation', this.handleToggleShipRotation)
  },
  methods: {
    handleSelectShip(ship: Ship) {
      this.selectedShip = ship
    },
    handleToggleShipRotation(ship: Ship) {
      ship.position.isVertical = !ship.position.isVertical
    },
    handleMessage(data: WebsocketMessage): void {
      if (data.type == 'player' && data.data.player) {
        this.player = data.data.player
      }
    },
    sendMessage(message: string): void {
      if (this.socketService) {
        this.socketService.sendMessage(message)
      }
    },
    sendSimpleAction(type: string): void {
      if (this.socketService) {
        const message: string = this.socketService.formatMessage(type)
        this.sendMessage(message)
      }
    },
    handleDropShip(rowIndex: number, colIndex: number) {
      if (this.socketService && this.selectedShip) {
        const message: string = this.socketService.formatMessage('place-ship', {
          ship_id: this.selectedShip.id,
          position: {
            row: rowIndex,
            col: colIndex,
            isVertical: this.selectedShip.position.isVertical
          }
        })
        this.sendMessage(message)
        this.dragShip(rowIndex, colIndex, false)
        this.selectedShip = null
      }
    },
    dragShip(row: number, col: number, isDragOver: boolean) {
      const ship = this.selectedShip

      if (!ship || !this.player) return

      let cells = []
      let isValid = true

      for (let i = 0; i < ship.size; i++) {
        const rowIndex = ship.position.isVertical ? row + i : row
        const colIndex = ship.position.isVertical ? col : col + i

        if (!this.isValidCoordinates(rowIndex, colIndex)) {
          isValid = false
          break
        }
        const cell = this.player.gameboard.grid[rowIndex][colIndex]
        cells.push(cell)
        isValid = isValid && cell.state !== 'ship' && cell.state !== 'adjacent'
      }

      const shipPlacementState = isDragOver ? (isValid ? 'valid' : 'invalid') : undefined
      for (let cell of cells) {
        cell.shipPlacementState = shipPlacementState
      }
    },
    handleDragOverCell(rowIndex: number, colIndex: number) {
      this.dragShip(rowIndex, colIndex, true)
    },
    handleDragLeaveCell(rowIndex: number, colIndex: number) {
      this.dragShip(rowIndex, colIndex, false)
    },
    handleRemoveShip() { 
      if (this.socketService && this.selectedShip) {
        const message: string = this.socketService.formatMessage('remove-ship', {
          ship_id: this.selectedShip.id
        })
        this.sendMessage(message)
        this.selectedShip = null
      }
    },
    isValidCoordinates(rowIndex: number, colIndex: number) {
      if (!this.player) return false
      const boardSize = this.player.gameboard.size
      return rowIndex < boardSize && colIndex < boardSize && rowIndex >= 0 && colIndex >= 0
    }
  }
})
</script>

<style lang="scss" scoped>
.game {
  &__container {
    display: flex;
    gap: 30px;
  }
  &__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;

    button {
      cursor: pointer;
    }
  }
}
</style>
