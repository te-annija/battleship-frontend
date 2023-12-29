<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The main component serves as the main container for the battleship game.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="game container">
    <div v-if="!player || loadingFriendGame" class="game__container card box-shadow">
      <div class="game__loading">
        <div><span class="spinner" /> Loading ...</div>
      </div>
    </div>
    <div v-if="player && !loadingFriendGame" class="card box-shadow game__container-wrap">
      <game-instructions
        :status="status"
        :friend-game-session-id="friendGameSessionID"
        :is-opponent-connected="opponent ? true : false"
        :is-player-turn="isPlayerTurn"
        :user="user"
        :opponent="opponentUser"
        :user-player="player"
        :opponent-player="opponent"
      />
      <div class="game__container">
        <ship-container
          class="game__shipcontainer"
          v-if="
            player.gameboard &&
            status !== gameStatusType.Game &&
            status !== gameStatusType.GameEnded
          "
          :ships="player.gameboard.ships"
          :is-game-mode="false"
          :is-edit-mode="
            status === gameStatusType.WaitingActive || status === gameStatusType.Prepare
          "
          @dragover.prevent
          @drop="handleRemoveShip"
        />

        <div class="game__container-main">
          <div class="game__gameboard">
            <game-board
              v-if="player.gameboard"
              :gameboard="player.gameboard"
              :is-game-mode="status === gameStatusType.Game"
              :is-edit-mode="
                status === gameStatusType.Prepare || status === gameStatusType.WaitingActive
              "
              :is-player-turn="isPlayerTurn"
              :is-player-game-board="true"
              @dropShip="handleDropShip"
            />

            <div class="game__actions-edit">
              <button
                v-if="status === gameStatusType.Prepare || status === gameStatusType.WaitingActive"
                @click="sendSimpleAction('randomize-ships')"
              >
                Randomize
              </button>
              <button
                v-if="status === gameStatusType.Prepare || status === gameStatusType.WaitingActive"
                @click="sendSimpleAction('reset-ships')"
              >
                Reset
              </button>
              <button
                class="game__actions-leave"
                v-if="status !== gameStatusType.Prepare && status !== gameStatusType.GameEnded"
                @click="handleLeaveGame()"
              >
                Leave Game
              </button>
            </div>
          </div>
          <div
            v-if="status === gameStatusType.Game || status == gameStatusType.GameEnded"
            class="game__gameboard"
          >
            <game-board
              v-if="player.attackGameboard"
              :gameboard="player.attackGameboard"
              :is-game-mode="status === gameStatusType.Game"
              :is-edit-mode="false"
              :is-waiting-mode="false"
              :is-player-turn="isPlayerTurn"
              :is-player-game-board="false"
              @attackCell="handleAttackCell"
            />
          </div>
          <div v-if="status === gameStatusType.Prepare" class="game__actions-create">
            <button :disabled="!isShipsPlaced" @click="startGame('random')">Play Online</button>
            <button :disabled="!isShipsPlaced" @click="startGame('friend')">
              Play With Friend
            </button>
            <button :disabled="!isShipsPlaced" @click="startGame('computer')">
              Play With Computer
            </button>
          </div>

          <game-waitingroom
            v-if="status === gameStatusType.Waiting || status === gameStatusType.WaitingActive"
            :player="player"
            :opponent="opponent"
            :friend-game-session-id="friendGameSessionID"
            :player-user="user"
            :opponent-user="opponentUser"
            :show-ready="isShipsPlaced"
            @toggleReady="toggleReady"
          />
        </div>
      </div>
      <div v-if="status === gameStatusType.GameEnded" class="game__overlay">
        <div class="game__overlay-content">
          <h2 v-if="status === gameStatusType.GameEnded && game">
            {{ game.isWinner ? 'Victory!' : 'Defeat!' }}
          </h2>
          <p v-if="user && game">{{ game.points }} points</p>
          <p v-if="!user && game && game.isWinner && game.points > 0">
            You would earn {{ game.points }} points if logged in
          </p>
          <router-link v-if="!user && game && game.isWinner && game.points > 0" to="/register"
            >Register Here</router-link
          >
          <button v-if="status === gameStatusType.GameEnded && opponent" @click="handleRematch()">
            Rematch
          </button>
          <div v-else>Oppontent left the game.</div>
          <button class="btn-red" @click="handleLeaveGame()">Leave Game</button>
        </div>
      </div>
    </div>
    <div v-if="showLeaveConfirmation && status === gameStatusType.Game" class="game__overlay">
      <div class="game__overlay-content">
        <h3>Are you sure you want to leave the game?</h3>
        <p>Be aware! This game will be counted as lost!</p>
        <div class="confirmation-buttons">
          <button @click="showLeaveConfirmation = false">Cancel</button>
          <button @click="handleLeaveGame()" class="btn-red">Leave Game</button>
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
import GameWaitingroom from './GameWaitingroom.vue'
import { type WebsocketMessage } from '@/types/WebSocketTypes'
import { type Player, type Ship, GameStatus } from '@/types/GameTypes'
import { $bus } from '@/utils/GlobalEmit'
import { useToast, POSITION } from 'vue-toastification'
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/User'
import userService from '@/services/UserService'
import GameInstructions from './GameInstructions.vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  data() {
    return {
      socketService: null as WebSocketService | null,
      player: null as Player | null,
      opponent: null as Player | null,
      opponentUser: null as User | null,
      status: GameStatus.Prepare as GameStatus,
      gameStatusType: GameStatus,
      isPlayerTurn: true as boolean,
      friendGameSessionID: null as string | null,
      game: null as { isWinner: boolean; points: number } | null,
      showLeaveConfirmation: false as boolean,
      loadingFriendGame: false as boolean,
      toast: useToast()
    }
  },
  components: {
    GameBoard,
    ShipContainer,
    GameWaitingroom,
    GameInstructions,
    RouterLink
  },
  mounted() {
    const params = new URL((document as any).location).searchParams
    if (params.get('id')) {
      this.friendGameSessionID = params.get('id')
      this.loadingFriendGame = true
      this.$router.push({})
    }

    setTimeout(() => {
      this.socketService = new WebSocketService()
    }, 1500)
    $bus.on('select-ship', this.handleSelectShip)
    $bus.on('websocket-connected', this.handleWebsocketConnected)
    $bus.on('websocket-message', this.handleWebsocketMessage)
    $bus.on('websocket-disconnected', this.handleWebsocketDisconnected)
  },
  beforeUnmount() {
    if (this.socketService) {
      this.socketService.close()
    }
    $bus.off('select-ship', this.handleSelectShip)
    $bus.off('websocket-connected', this.handleWebsocketConnected)
    $bus.off('websocket-message', this.handleWebsocketMessage)
    $bus.off('websocket-disconnected', this.handleWebsocketDisconnected)
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapActions(useUserStore, ['fetchUserData']),
    isShipsPlaced() {
      return this.player &&
        this.player.gameboard &&
        this.player.gameboard.ships.every((ship) => ship.isOnBoard)
        ? true
        : false
    }
  },
  methods: {
    handleConnectToWebsocket() {
      this.socketService = new WebSocketService()
    },
    async handleWebsocketMessage(data: WebsocketMessage): Promise<void> {
      switch (data.type) {
        case 'player':
          if (data.data.player) {
            this.player = data.data.player
          }
          break
        case 'game-started':
          this.status = this.gameStatusType.Game
          break
        case 'game-created':
          if (data.data.id && data.data.type === 'friend') {
            this.status = this.gameStatusType.WaitingActive
            this.friendGameSessionID = data.data.id
          }
          break
        case 'player-joined':
          if (!this.player) return
          this.loadingFriendGame = false
          if (this.status === this.gameStatusType.Game) break

          if (this.friendGameSessionID || this.opponent) {
            this.status = this.gameStatusType.WaitingActive
          } else {
            this.status = this.gameStatusType.Waiting
          }
          break
        case 'opponent':
          this.opponent = data.data
          try {
            const response: any = await userService.getUserByUsername(data.data.username)
            this.opponentUser = response.user
          } catch (error: any) {
            /* empty */
          }
          break
        case 'game-turn':
          if (data.data.isPlayerTurn) {
            this.isPlayerTurn = data.data.isPlayerTurn
          } else {
            this.isPlayerTurn = false
          }
          break
        case 'opponent-disconnected':
          this.toast.error('Opponent disconnected from the game.', {
            position: POSITION.BOTTOM_CENTER
          })

          this.opponent = null

          if (this.status === this.gameStatusType.WaitingActive && !this.friendGameSessionID) {
            this.handleLeaveGame()
          }

          break
        case 'host-disconnected':
          if (
            this.status === this.gameStatusType.WaitingActive ||
            this.status === this.gameStatusType.Waiting
          ) {
            this.handleLeaveGame()
          }
          break
        case 'ready-status':
          if (this.opponent && data.data.status) {
            this.opponent.isReady = data.data.status
          }
          break
        case 'game-ended':
          this.status = this.gameStatusType.GameEnded
          if (data.data) {
            this.game = data.data
          }

          if (this.opponent) {
            this.opponent.isReady = false
          }

          await this.fetchUserData

          if (this.opponentUser) {
            const response: any = await userService.getUserByUsername(this.opponentUser.username)
            this.opponentUser = response.user
          }
          break
        case 'error':
          if (data.data.message) {
            this.loadingFriendGame = false
            this.toast.error(data.data.message, { position: POSITION.BOTTOM_CENTER })
          }
      }
    },
    sendSimpleAction(type: string, data: any = null): void {
      if (this.socketService) {
        const message: string = this.socketService.formatMessage(type, data)
        this.socketService.sendMessage(message)
      }
    },
    handleSelectShip(ship: Ship) {
      if (!this.player || !this.player.gameboard) return
      if (!ship || !ship.isOnBoard) return
      const size = this.player.gameboard.size
      let endRow = ship.position.isVertical ? ship.position.row + ship.size : ship.position.row + 1
      let endCol = ship.position.isVertical ? ship.position.col + 1 : ship.position.col + ship.size

      for (let i = ship.position.row - 1; i <= endRow; i++) {
        for (let j = ship.position.col - 1; j <= endCol; j++) {
          if (i >= 0 && i < size && j >= 0 && j <= size) {
            const cell = this.player.gameboard.grid[i][j]

            if (cell && cell.adjacentCount && cell.adjacentCount <= 1) {
              cell.state = 'empty'
            } else if (cell && cell.ship) {
              cell.state = 'ghost-empty'
            }
          }
        }
      }
    },
    handleDropShip(ship: Ship, rowIndex: number, colIndex: number) {
      this.sendSimpleAction('place-ship', {
        ship_id: ship.id,
        position: {
          row: rowIndex,
          col: colIndex,
          isVertical: ship.position.isVertical
        }
      })
    },
    handleRemoveShip(event: DragEvent) {
      if (event && event.dataTransfer) {
        this.sendSimpleAction('remove-ship', { ship_id: event.dataTransfer.getData('shipId') })
      }
    },
    handleAttackCell(rowIndex: number, colIndex: number) {
      this.sendSimpleAction('attack-cell', { row: rowIndex, col: colIndex })
    },
    handleLeaveGame() {
      if (this.status === this.gameStatusType.Game && !this.showLeaveConfirmation) {
        this.showLeaveConfirmation = true
      } else {
        this.sendSimpleAction('leave-game')
        this.status = this.gameStatusType.Prepare
        this.showLeaveConfirmation = false
        this.opponent = null
        this.friendGameSessionID = null
        this.$router.push({})
      }
    },
    toggleReady() {
      if (this.player) {
        const isReady = this.player.isReady
        this.player.isReady = !isReady
        if (this.player.isReady) {
          this.status = this.gameStatusType.Waiting
        } else {
          this.status = this.gameStatusType.WaitingActive
        }

        this.sendSimpleAction('ready', { status: !isReady })
      }
    },
    startGame(gameMode: string) {
      switch (gameMode) {
        case 'random':
          this.sendSimpleAction('join-game-random', { type: 'random' })
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
      this.status = this.gameStatusType.WaitingActive
    },
    handleWebsocketConnected() {
      if (this.friendGameSessionID) {
        setTimeout(() => {
          this.sendSimpleAction('join-game-friend', { id: this.friendGameSessionID })
        }, 1000)
      }
    },
    handleWebsocketDisconnected() {
      this.player = null
      this.socketService = null

      setTimeout(() => {
        if (!this.socketService || !this.socketService.getIsOpen()) {
          this.socketService = new WebSocketService()
        }
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
    padding-top: 20px;
    align-items: start;

    &-wrap {
      position: relative;
    }

    &-main {
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    &-content {
      min-width: 200px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      background-color: $cl-bg-card;
      border-radius: 10px;

      a {
        text-decoration: underline;

        &:hover {
          color: blue;
        }
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
      top: -5px;
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
</style>
@/services/WebsocketService
