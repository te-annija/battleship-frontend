<!-- 
  FILENAME: LeaderboardPage.vue
  DESCRIPTION: The component serves as the main container for leaderboard page in the route '/leadeboard'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="leaderboard container">
    <div v-if="loading" class="box-shadow card leaderboard__loading">
      <span class="loader"></span> Loading...
    </div>
    <div v-else class="box-shadow card">
      <h1 class="text-center">Leaderboard</h1>
      <div class="leaderboard__table">
        <table v-if="users.length">
          <thead>
            <th></th>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
          </thead>
          <tbody>
            <tr
              :class="{ 'leaderboard-me': currentUser && currentUser.id === user.id }"
              v-for="(user, index) of users"
              :key="user.username"
            >
              <td>{{ index + 1 }}</td>
              <td><rank-widget :rank="user.rank" /></td>
              <td>
                <router-link :to="`/user/${user.username}`">{{ user.username }}</router-link>
                {{ currentUser && currentUser.id === user.id ? '(You)' : '' }}
              </td>
              <td>{{ user.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import UserService from '@/services/UserService'
import type { User } from '@/types/User'
import RankWidget from '@/components/widgets/RankWidget.vue'
import { RouterLink } from 'vue-router'
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'

export default defineComponent({
  components: {
    RankWidget,
    RouterLink
  },
  data() {
    return {
      users: [] as User[] | [],
      loading: true as boolean
    }
  },
  async mounted() {
    this.loading = true
    this.users = await UserService.getUsers('', 'points', 'desc', true, 100)
    this.loading = false
  },
  computed: {
    ...mapState(useUserStore, { currentUser: 'user' })
  }
})
</script>

<style scoped lang="scss">
@import '../assets/styles/_variables';

.leaderboard {
  max-width: 450px;
  margin: 0 auto;

  &__table {
    max-height: 70vh;
    overflow-y: auto;
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
  }

  a {
    text-decoration: underline;

    &:hover {
      color: blue;
    }
  }

  &-me {
    background: #be0afa7e !important;
  }
}
</style>
