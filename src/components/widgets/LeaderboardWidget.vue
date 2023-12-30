<!-- 
  FILENAME: LeaderboardWidget.vue
  DESCRIPTION: The component renders leaderboard table - users sorted by points.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="leaderboard">
    <div v-if="loading" class="text-center"><span class="spinner"></span> Loading...</div>
    <div v-else class="leaderboard__table">
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
</template>

<script lang="ts">
import UserService from '@/services/UserService'
import type { User } from '@/types/User'
import RankWidget from '@/components/widgets/RankWidget.vue'
import { RouterLink } from 'vue-router'
import { defineComponent, type PropType } from 'vue'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'

export default defineComponent({
  components: {
    RankWidget,
    RouterLink
  },
  props: {
    limit: {
      type: Number as PropType<number>,
      default: 10
    }
  },
  data() {
    return {
      users: [] as User[] | [],
      loading: true as boolean
    }
  },
  async mounted() {
    this.loading = true
    this.users = await UserService.getUsers('', 'points', 'desc', true, this.limit)
    this.loading = false
  },
  computed: {
    ...mapState(useUserStore, { currentUser: 'user' })
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables';
.leaderboard {
  &__table {
    max-height: 65vh;
    overflow-y: auto;
  }

  &-me {
    background: #be0afa7e !important;
  }

  table {
    border: solid 2px $cl-secondary;
    width: 100%;
    border-collapse: collapse;
    background: $cl-bg-card;

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
      padding: 1px;
      text-align: center;
    }

    a {
      text-decoration: underline;

      &:hover {
        color: $cl-deep-blue;
      }
    }
  }
}
</style>
