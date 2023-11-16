<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The main component serves as the main container for the battleship game.
  AUTHOR: Annija Karitone 
-->
<template>
  <div v-if="player" class="game">
    <h2>Hello {{ player.name }}</h2>
    <div class="game__container">
      <game-board
        v-if="player.gameboard"
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
        v-if="isEditMode && player.gameboard"
        :ships="player.gameboard.ships"
        :is-game-mode="isGameMode"
        :is-edit-mode="isEditMode"
        @dragover.prevent
        @drop="handleRemoveShip"
      />

      <div v-if="!isGameMode && !isWaitingMode" class="game__actions-create">
        <button :disabled="!isShipsPlaced" @click="startGame('random')">Play Online</button>
        <button :disabled="!isShipsPlaced" @click="startGame('friend')">Play With Friend</button>
        <button :disabled="!isShipsPlaced" @click="startGame('computer')">
          Play With Computer
        </button>
      </div>

      <div v-if="isWaitingMode" class="game__waitingroom">
        <div v-if="!isOpponentConnected">
          <div class="spinner" />
          <p>Waiting for opponent to join...</p>
        </div>

        <div v-if="friendGameroomID && !isOpponentConnected">
          <div>Share this link with your friend:</div>
          <div>{{ generateFriendLink }}</div>
        </div>
        <div v-if="isOpponentConnected && opponent">
          <div>
            <p>Players connected:</p>
            <p>
              You
              <status-widget
                :is-status-green="player.isReady"
                :is-status-red="!player.isReady"
                status-green-text="Player Ready"
                status-red-text="Player Not Ready"
              />
            </p>
            <p>
              {{ opponent.name }}
              <status-widget
                :is-status-green="opponent.isReady"
                :is-status-red="!opponent.isReady"
                status-green-text="Player Ready"
                status-red-text="Player Not Ready"
              />
            </p>
          </div>
          <button :disabled="!isShipsPlaced" @click="toggleReady()">
            {{ player.isReady ? 'Not Ready' : 'Ready' }}
          </button>
        </div>
      </div>
      <game-board
        v-if="isGameMode && player.enemyGameboard"
        :gameboard="player.enemyGameboard"
        :is-game-mode="isGameMode"
        :is-edit-mode="false"
        :is-waiting-mode="isWaitingMode"
        :is-player-turn="isPlayerTurn && isOpponentConnected"
        :is-player-game-board="false"
        @attackCell="handleAttackCell"
      />
    </div>
    <div class="game__actions-edit">
      <button v-if="isEditMode" @click="sendSimpleAction('randomize-ships')">
        Randomize
      </button>
      <button v-if="isEditMode" @click="sendSimpleAction('reset-ships')">
        Reset
      </button>
      <button v-if="isGameMode || isWaitingMode" @click="handleLeaveGame()">Leave Game</button>
    </div>
    <div v-if="isGameMode && !isOpponentConnected">Opponent disconnected!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WebSocketService from '@/services/WebSocketService'
import GameBoard from './GameBoard.vue'
import ShipContainer from './ShipContainer.vue'
import StatusWidget from '@/components/widgets/StatusWidget.vue'
import { type WebsocketMessage } from '@/types/WebSocketTypes'
import { type Player, type Ship } from '@/types/GameTypes'
import { $bus } from '@/utils/GlobalEmit'

export default defineComponent({
  data() {
    return {
      socketService: null as WebSocketService | null,
      player: null as Player | null,
      opponent: null as Player | null,
      selectedShip: null as Ship | null,
      isGameMode: false as boolean,
      isEditMode: true as boolean,
      isPlayerTurn: true as boolean,
      isWaitingMode: false as boolean,
      isOpponentConnected: false as boolean,
      friendGameroomID: null as string | null
    }
  },
  components: {
    GameBoard,
    ShipContainer,
    StatusWidget
  },
  mounted() {
    this.socketService = new WebSocketService()
    this.socketService.addMessageHandler(this.handleMessage)

    const params = new URL((document as any).location).searchParams
    if (params.get('id')) {
      this.friendGameroomID = params.get('id')
    }

    $bus.on('select-ship', this.handleSelectShip)
    $bus.on('toggle-ship-rotation', this.handleToggleShipRotation)
    $bus.on('websocket-connected', this.handleWebsocketConnected)
  },
  beforeUnmount() {
    if (this.socketService) {
      this.socketService.close()
    }
    $bus.off('select-ship', this.handleSelectShip)
    $bus.off('toggle-ship-rotation', this.handleToggleShipRotation)
    $bus.off('websocket-connected', this.handleWebsocketConnected)
  },
  computed: {
    isShipsPlaced() {
      return (
        this.player &&
        this.player.gameboard &&
        this.player.gameboard.ships.every((ship) => ship.isOnBoard)
      )
    },
    generateFriendLink(): string {
      if (!this.friendGameroomID) {
        return ''
      }
      return `${window.location.host}?id=${this.friendGameroomID}`
    }
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
        case 'game-created':
          if (data.data.id && data.data.type === 'friend') {
            this.friendGameroomID = data.data.id
            this.$router.push({
              query: { id: data.data.id }
            })
          }
          break
        case 'player-joined':
          if (!this.player) return
          this.player.isReady = false
          this.isWaitingMode = true && !this.isGameMode
          this.isEditMode = this.friendGameroomID ? true && !this.isGameMode : false
          break
        case 'opponent':
          this.isOpponentConnected = true
          this.opponent = data.data
          break
        case 'player-turn':
          this.isPlayerTurn = true
          break
        case 'opponent-turn':
          this.isPlayerTurn = false
          break
        case 'opponent-disconnected':
          this.isOpponentConnected = false
          break
        case 'host-disconnected':
          this.isOpponentConnected = false
          this.handleLeaveGame()
          break
        case 'ready-status':
          if (this.opponent && data.data.status) {
            this.opponent.isReady = data.data.status
          }
          break
      }
    },
    sendMessage(message: string): void {
      if (this.socketService) {
        this.socketService.sendMessage(message)
      }
    },
    sendSimpleAction(type: string, data: any = null): void {
      if (this.socketService) {
        const message: string = this.socketService.formatMessage(type, data)
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

      if (!ship || !this.player || !this.player.gameboard) return

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
      if (!this.player || !this.player.gameboard) return false
      const boardSize: number = this.player.gameboard.size
      return rowIndex < boardSize && colIndex < boardSize && rowIndex >= 0 && colIndex >= 0
    },
    handleLeaveGame() {
      this.sendSimpleAction('leave-game')
      this.isGameMode = false
      this.isEditMode = true
      this.isWaitingMode = false
      this.isOpponentConnected = false
      this.friendGameroomID = null
      this.$router.push({})
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
    toggleReady() {
      if (this.player) {
        const isReady = this.player.isReady
        this.player.isReady = !isReady
        this.isEditMode = isReady

        this.sendSimpleAction('ready', { status: !isReady })
      }
    },
    startGame(gameMode: string) {
      switch (gameMode) {
        case 'random':
          this.sendSimpleAction('join-room', { type: 'random' })
          this.isWaitingMode = true
          break
        case 'computer':
          this.sendSimpleAction('create-room', { type: 'computer' })
          break
        case 'friend':
          this.sendSimpleAction('create-room', { type: 'friend' })
          break
      }
    },
    handleWebsocketConnected() {
      if (this.socketService && this.friendGameroomID) {
        const message: string = this.socketService.formatMessage('join-room', {
          id: this.friendGameroomID
        })
        this.sendMessage(message)
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
    &-edit {
      button {
        cursor: pointer;
      }
    }

    &-create {
      display: flex;
      flex-direction: column;
      gap: 10px;

      button {
        cursor: pointer;
      }
    }
  }
}
</style>
