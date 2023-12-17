<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The main component serves as the main container for the battleship game.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="game container">
    <div v-if="!player" class="game__container card box-shadow">
      <div class="game__loading">
        <div><span class="spinner" /> Loading ...</div>
      </div>
    </div>
    <div v-if="player" class="game__container card box-shadow">
      <ship-container
        class="game__shipcontainer"
        v-if="player.gameboard && isEditMode"
        :ships="player.gameboard.ships"
        :is-game-mode="isGameMode"
        :is-edit-mode="isEditMode"
        @dragover.prevent
        @drop="handleRemoveShip"
      />

      <div class="game__container-wrap">
        <div class="game__gameboard">
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
          <div class="game__actions-edit">
            <button v-if="isEditMode" @click="sendSimpleAction('randomize-ships')">
              Randomize
            </button>
            <button v-if="isEditMode" @click="sendSimpleAction('reset-ships')">Reset</button>
            <button
              class="game__actions-leave"
              v-if="(isGameMode || isWaitingMode) && !isGameOverMode"
              @click="handleLeaveGame()"
            >
              Leave Game
            </button>
          </div>
        </div>
        <div v-if="isGameMode" class="game__gameboard">
          <game-board
            v-if="isGameMode && player.attackGameboard"
            :gameboard="player.attackGameboard"
            :is-game-mode="isGameMode"
            :is-edit-mode="false"
            :is-waiting-mode="isWaitingMode"
            :is-player-turn="isPlayerTurn && isOpponentConnected"
            :is-player-game-board="false"
            @attackCell="handleAttackCell"
          />
        </div>
        <div v-if="!isGameMode && !isWaitingMode" class="game__actions-create">
          <button :disabled="!isShipsPlaced" @click="startGame('random')">Play Online</button>
          <button :disabled="!isShipsPlaced" @click="startGame('friend')">Play With Friend</button>
          <button :disabled="!isShipsPlaced" @click="startGame('computer')">
            Play With Computer
          </button>
        </div>

        <div v-if="!isGameMode && isWaitingMode" class="game__waitingroom">
          <div v-if="player.gameSessionId || friendGameSessionID">
            Game Session ID: {{ player.gameSessionId || friendGameSessionID }}
          </div>
          <div>
            Players:
            <div>
              <p>
                You ({{ player.name }})
                <status-widget
                  v-if="isOpponentConnected"
                  :is-status-green="player.isReady"
                  :is-status-red="!player.isReady"
                  status-green-text="Player Ready"
                  status-red-text="Player Not Ready"
                />
              </p>
            </div>
            <div>
              <div v-if="!isOpponentConnected">
                <p>Opponent: <span class="spinner" /> Waiting</p>
              </div>
              <div v-if="isOpponentConnected && opponent">
                <p>
                  Opponent: {{ opponent.name }}
                  <status-widget
                    :is-status-green="opponent.isReady"
                    :is-status-red="!opponent.isReady"
                    status-green-text="Player Ready"
                    status-red-text="Player Not Ready"
                  />
                </p>
              </div>
              <div v-if="friendGameSessionID && !isOpponentConnected">
                <div>Share this link with your friend:</div>
                <div class="game__waitingroom-link">
                  <input v-model="generateFriendLink" readonly />
                  <img
                    v-if="!isLinkCopied"
                    class="copy-icon"
                    alt="Copy"
                    src="@/assets/icons/copy.svg"
                    height="20"
                    v-clipboard:copy="generateFriendLink"
                    v-clipboard:success="onSuccessCopy"
                  />
                  <img v-else alt="Copied" src="@/assets/icons/copied.svg" height="20" />
                </div>
              </div>
              <div v-if="(friendGameSessionID || player.gameSessionId) && isOpponentConnected">
                <button :disabled="!isShipsPlaced" @click="toggleReady()">
                  {{ player.isReady ? 'Not Ready' : 'Ready' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isGameOverMode || (isGameMode && !isOpponentConnected)" class="game__overlay">
        <div class="game__overlay-content">
          <h2 v-if="isGameOverMode">{{ hasWon ? 'You won the game!' : 'You lost the game!' }}</h2>
          <button v-if="isGameOverMode && isOpponentConnected" @click="handleRematch()">
            Rematch
          </button>
          <div v-else>Oppontent left the game.</div>
          <button class="btn-red" @click="handleLeaveGame()">Leave Game</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { WebSocketService } from '@/services/WebsocketService'
import GameBoard from './GameBoard.vue'
import ShipContainer from './ShipContainer.vue'
import StatusWidget from '@/components/widgets/StatusWidget.vue'
import { type WebsocketMessage } from '@/types/WebSocketTypes'
import { type Player, type Ship } from '@/types/GameTypes'
import { $bus } from '@/utils/GlobalEmit'
import { useToast, POSITION } from 'vue-toastification'

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
      isGameOverMode: false as boolean,
      isRematchMode: false as boolean,
      isOpponentConnected: false as boolean,
      friendGameSessionID: null as string | null,
      isLinkCopied: false as boolean,
      hasWon: false as boolean,
      toast: useToast()
    }
  },
  components: {
    GameBoard,
    ShipContainer,
    StatusWidget
  },
  mounted() {
    const params = new URL((document as any).location).searchParams
    if (params.get('id')) {
      this.friendGameSessionID = params.get('id')
    }

    setTimeout(() => {
      this.socketService = new WebSocketService()
    }, 1500)

    $bus.on('select-ship', this.handleSelectShip)
    $bus.on('toggle-ship-rotation', this.handleToggleShipRotation)
    $bus.on('websocket-connected', this.handleWebsocketConnected)
    $bus.on('websocket-message', this.handleWebsocketMessage)
    $bus.on('websocket-disconnected', this.handleWebsocketDisconnected)
  },
  beforeUnmount() {
    if (this.socketService) {
      this.socketService.close()
    }
    $bus.off('select-ship', this.handleSelectShip)
    $bus.off('toggle-ship-rotation', this.handleToggleShipRotation)
    $bus.off('websocket-connected', this.handleWebsocketConnected)
    $bus.off('websocket-message', this.handleWebsocketMessage)
    $bus.off('websocket-disconnected', this.handleWebsocketDisconnected)
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
      if (!this.friendGameSessionID) {
        return ''
      }
      return `${window.location.host}${window.location.pathname}?id=${this.friendGameSessionID}`
    }
  },
  methods: {
    handleConnectToWebsocket() {
      this.socketService = new WebSocketService()
    },
    handleSelectShip(ship: Ship) {
      this.selectedShip = ship
    },
    handleToggleShipRotation(ship: Ship) {
      ship.position.isVertical = !ship.position.isVertical
    },
    handleWebsocketMessage(data: WebsocketMessage): void {
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
            this.friendGameSessionID = data.data.id
            this.$router.push({
              query: { id: data.data.id }
            })
          }
          break
        case 'player-joined':
          if (!this.player) return
          this.isWaitingMode = true && !this.isGameMode
          this.isEditMode =
            this.friendGameSessionID || this.isOpponentConnected ? true && !this.isGameMode : false
          break
        case 'opponent':
          this.isOpponentConnected = true
          this.opponent = data.data
          break
        case 'game-turn':
          if (data.data.isPlayerTurn) {
            this.isPlayerTurn = data.data.isPlayerTurn
          } else {
            this.isPlayerTurn = false
          }
          break
        case 'opponent-disconnected':
          this.isOpponentConnected = false
          if (this.isEditMode) {
            this.toast.error('Opponent disconnected from the game.', {
              position: POSITION.BOTTOM_CENTER
            })
          }

          if (this.isGameOverMode || this.isRematchMode) {
            this.handleLeaveGame()
          }

          break
        case 'host-disconnected':
          this.handleLeaveGame()
          break
        case 'ready-status':
          if (this.opponent && data.data.status) {
            this.opponent.isReady = data.data.status
          }
          break
        case 'game-ended':
          this.isGameOverMode = true
          if (data.data) {
            this.hasWon = data.data.hasWon
          }
          break
        case 'error':
          if (data.data.message) {
            this.toast.error(data.data.message, { position: POSITION.BOTTOM_CENTER })
          }
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
      this.isGameOverMode = false
      this.isOpponentConnected = false
      this.isRematchMode = false
      this.opponent = null
      this.friendGameSessionID = null
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
          this.sendSimpleAction('join-game-random', { type: 'random' })
          this.isWaitingMode = true
          break
        case 'computer':
          this.sendSimpleAction('create-game', { type: 'computer' })
          break
        case 'friend':
          this.sendSimpleAction('create-game', { type: 'friend' })
          break
      }
    },
    handleRematch() {
      this.sendSimpleAction('rematch-game')
      this.isGameMode = false
      this.isEditMode = true
      this.isWaitingMode = true
      this.isGameOverMode = false
      this.isRematchMode = true
    },
    handleWebsocketConnected() {
      if (this.socketService && this.friendGameSessionID) {
        const message: string = this.socketService.formatMessage('join-game-friend', {
          id: this.friendGameSessionID
        })
        this.sendMessage(message)
      }
    },
    handleWebsocketDisconnected() {
      this.player = null
      setTimeout(() => {
        this.socketService = new WebSocketService()
      }, 1500)
    },
    onSuccessCopy() {
      this.isLinkCopied = true
      setTimeout(() => {
        this.isLinkCopied = false
      }, 1500)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_variables';

.game {
  &__container {
    position: relative;
    min-height: 520px;
    display: flex;
    gap: 20px;
    align-items: start;

    &-wrap {
      display: flex;
      width: 100%;
      justify-content: space-around;
      flex-wrap: wrap;
    }
  }

  &__loading {
    margin: 0 auto;
    align-self: center;
    font-size: large;
  }

  &__shipcontainer {
    margin-top: 30px;
    border: solid 1px $cl-brdr-game;
    border-radius: 5px;
  }

  &__gameboard {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 330px;
    gap: 10px;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust opacity as needed */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999; /* Ensure the overlay is above other elements */

    &-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      background-color: $cl-bg-card; /* Adjust opacity as needed */
      border-radius: 10px;
    }
  }

  &__waitingroom {
    margin-top: 30px;
    margin-left: 30px;
    padding: 10px;
    border: solid 1px $cl-brdr-game;
    border-radius: 5px;

    max-width: 300px;
    width: 100%;

    &-link {
      position: relative;
      height: 30px;
      width: 100%;

      input {
        width: 100%;
        height: 100%;
        padding: 5px;
        background: $cl-bg-card;
        font-size: 16px;
        border: none;
        color: $cl-text;
        border-radius: 5px;

        &:focus {
          outline: none;
          border: none;
        }
      }

      img {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
      }
    }
  }

  &__actions {
    &-edit,
    &-create {
      display: flex;
      gap: 5px;
      margin-left: 30px;
    }

    &-create {
      max-width: 300px;
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 30px;
    }

    &-leave {
      font-size: 16px;
      position: absolute;
      top: 10px;
      right: 10px;
      border: solid 1px $cl-red;
      color: $cl-red;

      &:hover {
        color: $cl-text;
        background: $cl-red;
        border: solid 1px $cl-red;
        box-shadow: 0 0 0 1px $cl-red;
      }
    }
  }
}

html[data-theme='light'] {
  .copy-icon {
    filter: invert(100%);
  }
}
</style>
@/services/WebsocketService
