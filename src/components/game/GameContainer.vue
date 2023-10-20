<!-- 
  FILENAME: GameContainer.vue
  DESCRIPTION: The main component serves as the main container for the battleship game.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="game" v-if="player">
    <h2>Hello {{ player.id }}</h2>
    <div class="game__container">
      <game-board :gameboard="player.gameboard" />
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
import { type WebsocketMessage } from '@/types/WebSocketTypes'
import { type Player } from '@/types/GameTypes'

export default defineComponent({
  data() {
    return {
      socketService: null as WebSocketService | null,
      player: null as Player | null
    }
  },
  components: {
    GameBoard
  },
  mounted() {
    this.socketService = new WebSocketService()
    this.socketService.addMessageHandler(this.handleMessage)
  },
  beforeUnmount() {
    if (this.socketService) {
      this.socketService.close()
    }
  },
  methods: {
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
      const message: WebsocketMessage = {
        type: type,
        data: null
      }
      this.sendMessage(JSON.stringify(message))
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
