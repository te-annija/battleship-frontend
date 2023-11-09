<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The main component serves as the main container for the battleship game.
  AUTHOR: Annija Karitone 
-->
<template>
  <div v-if="player" class="game">
    <h2>Hello {{ player.id }}</h2>
    <div class="game__container">
      <game-board
        :gameboard="player.gameboard"
        :is-game-mode="isGameMode"
        :is-edit-mode="isEditMode"
        :is-player-turn="isPlayerTurn"
        :is-player-game-board="true"
        @dropShip="handleDropShip"
        @dragOver="handleDragOverCell"
        @dragLeave="handleDragLeaveCell"
      />
      <ship-container
        v-if="!isGameMode && isEditMode"
        :ships="player.gameboard.ships"
        :is-game-mode="isGameMode"
        :is-edit-mode="isEditMode"
        @dragover.prevent
        @drop="handleRemoveShip"
      />
      <div v-if="!isGameMode && isEditMode" class="game__actions-edit">
        <button @click="sendSimpleAction('randomize-ships')">Randomize</button>
        <button @click="sendSimpleAction('reset-ships')">Reset</button>
        <button @click="confirmShipPlacement()">Confirm Ship Placement</button>
      </div>
      <div v-if="!isGameMode && !isEditMode" class="game__actions-create">
        <span>Choose opponent:</span>
        <div>
          <button
            @click="chooseOpponent('computer')"
            :class="{ selected: selectedOpponent === 'computer' }"
          >
            Computer
          </button>
          <button
            @click="chooseOpponent('random')"
            :class="{ selected: selectedOpponent === 'random' }"
          >
            Random
          </button>
        </div>
        <div>
          <button @click="startGame()">Play</button>
        </div>
      </div>
      <game-board
        v-if="isGameMode"
        :gameboard="player.enemyGameboard"
        :is-game-mode="isGameMode"
        :is-edit-mode="isEditMode"
        :is-player-turn="isPlayerTurn && isOpponentConnected"
        :is-player-game-board="false"
        @attackCell="handleAttackCell"
      />
    </div>
    <button v-if="isGameMode" @click="handleLeaveGame()">Leave Game</button>
    <game-waiting-overlay v-if="isWaitingMode" />
    <div v-if="isGameMode && !isOpponentConnected">Opponent disconnected!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WebSocketService from '@/services/WebSocketService'
import GameBoard from './GameBoard.vue'
import ShipContainer from './ShipContainer.vue'
import GameWaitingOverlay from './GameWaitingOverlay.vue'
import { type WebsocketMessage } from '@/types/WebSocketTypes'
import { type Player, type Ship } from '@/types/GameTypes'
import { $bus } from '@/utils/GlobalEmit'

export default defineComponent({
  data() {
    return {
      socketService: null as WebSocketService | null,
      player: null as Player | null,
      selectedShip: null as Ship | null,
      isGameMode: false as boolean,
      isEditMode: true as boolean,
      isPlayerTurn: true as boolean,
      isWaitingMode: false as boolean,
      selectedOpponent: 'computer' as string,
      isOpponentConnected: false as boolean
    }
  },
  components: {
    GameBoard,
    ShipContainer,
    GameWaitingOverlay
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
      switch (data.type) {
        case 'player':
          if (data.data.player) {
            this.player = data.data.player
          }
          break
        case 'game-started':
          this.isOpponentConnected = true
          this.isGameMode = true
          this.isEditMode = false
          this.isWaitingMode = false
          break
        case 'player-turn':
          this.isPlayerTurn = true
          break
        case 'opponent-turn':
          this.isPlayerTurn = false
          break
        case 'opponent-disconnected':
          this.isOpponentConnected = false
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
      const boardSize: number = this.player.gameboard.size
      return rowIndex < boardSize && colIndex < boardSize && rowIndex >= 0 && colIndex >= 0
    },
    handleLeaveGame() {
      this.sendSimpleAction('leave-game')
      this.isGameMode = false
      this.isEditMode = true
      this.isOpponentConnected = false
    },
    handleAttackCell(rowIndex: number, colIndex: number) {
      if (this.socketService) {
        const message: string = this.socketService.formatMessage('attack-cell', {
          row: rowIndex,
          col: colIndex
        })
        this.sendMessage(message)
        this.selectedShip = null
      }
    },
    confirmShipPlacement() {
      if (this.player && this.player.gameboard.ships.every((ship) => ship.isOnBoard)) {
        this.isEditMode = false
      }
    },
    chooseOpponent(opponent: string) {
      this.selectedOpponent = opponent
    },
    startGame() {
      switch (this.selectedOpponent) {
        case 'random':
          this.sendSimpleAction('join-room')
          this.isWaitingMode = true
          break
        case 'computer':
          this.sendSimpleAction('create-room-ai')
          break
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.game {
  position: relative;
  padding: 30px;

  &__container {
    display: flex;
    gap: 30px;
  }

  &__actions {
    button {
      cursor: pointer;
    }

    &-edit {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &-create {
      .selected {
        border: 2px solid green;
        background-color: transparentize(green, 0.7);
      }
    }
  }
}
</style>
