<!-- 
  FILENAME: HistoryPage.vue
  DESCRIPTION: The component serves as the main container for game history page in the route '/history'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="history container">
    <div v-if="loading" class="box-shadow card history__loading">
      <span class="spinner" /> Loading...
    </div>
    <div v-else class="history__card box-shadow card">
      <h2 class="text-center">Game History</h2>
      <div class="history__games" v-if="!isReplayOpen">
        <div class="history__actions">
          <div
            v-for="type in gameTypes"
            :key="type"
            @click="filterByGameType(type)"
            :class="{ 'history__actions-selected': type === selectedGameType }"
          >
            {{ type }}
          </div>
        </div>

        <div class="history__table" v-if="user">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Winner</th>
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="game in paginatedGames"
                :key="game.id"
                :class="[game.winnerId === user.id ? 'history__row-won' : 'history__row-lost']"
              >
                <td>{{ game.createdAt }}</td>
                <td>
                  <router-link
                    v-if="game.players.length > 1"
                    :to="`user/${getOpponentUsername(game)}`"
                  >
                    {{ getOpponentUsername(game) }}</router-link
                  >
                  <span v-else> {{ getOpponentUsername(game) }} </span>
                </td>
                <td>{{ game.winnerId === user.id ? 'You' : 'Opponent' }}</td>
                <td>{{ game.GameUser.points }}</td>
                <td><button @click="handleOpenReplay(game)">Replay</button></td>
              </tr>
              <tr v-if="games && games.length <= 0">
                <td colspan="6">No games found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="history__pagination">
          <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
      <replay-container v-else @closeReplay="handleCloseReplay" :game="selectedGame" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import UserService from '@/services/UserService'
import ReplayContainer from '@/components/game/ReplayContainer.vue'

const toast = useToast()

export default defineComponent({
  components: {
    RouterLink,
    ReplayContainer
  },
  data() {
    return {
      loading: false as boolean,
      games: [] as any,
      isReplayOpen: false as boolean,
      selectedGame: null as any,
      pageSize: 10 as number,
      currentPage: 1 as number,
      filterParams: '' as string,
      gameTypes: ['online', 'friend', 'computer'] as string[],
      selectedGameType: 'online' as string
    }
  },
  async mounted() {
    await this.fetchGames()
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    totalPages(): number {
      return Math.ceil(this.games.length / Number(this.pageSize))
    },
    paginatedGames(): any[] {
      const startIndex = (Number(this.currentPage) - 1) * Number(this.pageSize)
      const endIndex = Number(startIndex) + Number(this.pageSize)
      return this.games.slice(startIndex, endIndex)
    }
  },
  methods: {
    getOpponentUsername(game: any): string {
      const user = this.user
      
      if (!user) {
        return 'Unknown'
      }

      if (game && game.gameType === 'computer') {
        return 'Friendly AI'
      }

      const opponent = game.players.find((player: any) => { 
        player.username !== user.username
      })

      if (!opponent) {
        return 'Guest'
      }

      return opponent.username
    },
    handleOpenReplay(game: any) {
      this.selectedGame = game
      this.isReplayOpen = true
    },
    handleCloseReplay() {
      this.selectedGame = null
      this.isReplayOpen = false
    },
    previousPage() {
      if (Number(this.currentPage) > 1) {
        this.currentPage = Number(this.currentPage) - 1
      }
    },
    nextPage() {
      if (Number(this.currentPage) < Number(this.totalPages)) {
        this.currentPage = Number(this.currentPage) + 1
      }
    },
    async filterByGameType(gameType: string) {
      this.selectedGameType = gameType
      await this.fetchGames()
    },
    async fetchGames() {
      if (!this.user) return
      try {
        const filterParams = `gameType:${
          this.selectedGameType === 'online' ? 'random' : this.selectedGameType
        }`
        this.games = await UserService.getUserGames(this.user.id.toString(), filterParams)
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }
})
</script>

<style scoped lang="scss">
@import '../assets/styles/_variables';

.history {
  width: 100%;

  h2 {
    margin-bottom: 20px;
  }

  &__card {
    position: relative;
  }

  &__games {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__pagination {
    padding-top: 10px;
    display: flex;
    gap: 5px;
    align-self: flex-start;
  }

  &__table {
    width: 100%;
    overflow-x: auto;
  }

  &__row {
    &-won {
      background-color: rgba(0, 128, 0, 0.192) !important;
    }

    &-lost {
      background-color: rgba(128, 0, 0, 0.192) !important;
    }
  }

  &__actions {
    display: flex;
    width: 100%;
    height: 37px;

    div {
      cursor: pointer;
      text-transform: uppercase;
      border: solid 1px black;
      background-color: #adc3cc4d;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      &:hover {
        background-color: #adc3cc8f;
      }
    }

    &-selected {
      background-color: #adc3cce3 !important;
    }
  }

  table {
    border: solid 2px $cl-secondary;
    width: 100%;
    border-collapse: collapse;

    thead,
    tr {
      border: solid 5px $cl-bg-card;
      border-radius: 10px;
      margin-top: 5px;
      background-color: #adc3cc4d;
    }

    th {
      background: $cl-bg-navbar-account;
    }

    th,
    td {
      padding: 5px;
      text-align: center;
    }

    a {
      text-decoration: underline;

      &:hover {
        color: blue;
      }
    }
  }
}
</style>
