<!-- 
  FILENAME: GameWaitingRoom.vue
  DESCRIPTION: The component renders a container where data about players and their game readiness status is displayed.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="waitingroom">
    <div v-if="player.gameSessionId || friendGameSessionId">
      Game Session ID: {{ player.gameSessionId }}
    </div>
    <table v-if="players.length">
      <thead>
        <tr>
          <th>Players</th>
          <th>Username</th>
          <th>Rank</th>
          <th>Ready?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in players" :key="index">
          <td>
            {{ player.type }}
            <span v-if="!player.user && player.data" class="opacity">(Guest)</span>
          </td>
          <td v-if="!player.data" colspan="3"><span class="spinner" /> waiting...</td>
          <td v-if="player.data">{{ player.data.username }}</td>
          <td v-if="player.data">
            <img
              v-if="player.user && player.user.rank"
              :src="getImgPath(player.user.rank.icon)"
              :alt="player.user.rank.title"
            />
            <span>{{ player.user && player.user.rank ? player.user.rank.title : '-' }}</span>
          </td>
          <td v-if="player.data">
            <status-widget
              :is-status-green="player.data.isReady"
              :is-status-red="!player.data.isReady"
            />
            <span class="waitingroom-status opacity">
              {{ player.data.isReady ? 'Ready!' : 'Not Ready' }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="(friendGameSessionId || player.gameSessionId) && opponent">
      <button :disabled="!showReady" @click="$emit('toggleReady')">
        {{ player.isReady ? 'Not Ready' : 'Ready' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import StatusWidget from '@/components/widgets/StatusWidget.vue'
import type { User } from '@/types/User'
import type { Player } from '@/types/GameTypes'

export default defineComponent({
  props: {
    player: {
      type: Object as PropType<Player>,
      required: true
    },
    opponent: {
      type: Object as PropType<Player | null>,
      default: null
    },
    friendGameSessionId: {
      type: String as PropType<String | null>,
      default: null
    },
    playerUser: {
      type: Object as PropType<User | null>,
      default: null
    },
    opponentUser: {
      type: Object as PropType<User | null>,
      default: null
    },
    showReady: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  components: {
    StatusWidget
  },
  computed: {
    players() {
      return [
        { type: 'you', data: this.player, user: this.playerUser },
        { type: 'opponent', data: this.opponent, user: this.opponentUser }
      ]
    }
  },
  methods: {
    getImgPath(value: any) {
      return `${import.meta.env.VITE_SERVER_URL}${value}`
    }
  }
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/_variables';
.waitingroom {
  margin-top: 30px;
  margin-left: 30px;
  padding: 10px;
  border: solid 1px $cl-brdr-game;
  border-radius: 5px;
  max-width: 300px;
  width: 100%;

  table {
    background: #adc3cc4d;
    border-radius: 5px;

    td,
    th {
      border: solid 1px $cl-brdr-game;
      padding: 5px;
      border-radius: 5px;
      text-align: center;
      font-size: 14px;
    }

    th {
      background: $cl-bg-navbar-account;
    }
  }

  &-status {
    padding-left: 2px;
  }
}
</style>
