<!-- 
  FILENAME: ProfilePage.vue
  DESCRIPTION: The component serves as the main container for profile page in the route '/profile'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="profile">
    <div v-if="loading" class="box-shadow card profile__loading">
      <span class="spinner" /> Loading...
    </div>
    <div v-else class="box-shadow card">
      <h1 class="text-center">Profile</h1>
      <div v-if="user" class="profile__section">
        <h2>{{ user.username }}</h2>
        <p>Joined {{ formatDate(user.createdAt) }}</p>
        <p>{{ user.role ? 'Administrator' : '' }}</p>
      </div>

      <div v-if="user && userStats" class="profile__section">
        <h2 class="text-center">Statistics</h2>
        <div class="profile__statistics">
          <div class="profile__card">
            <div class="">Current rank</div>
            <div>
              <rank-widget :rank="user.rank" />
              {{ user.rank.title }}
            </div>
          </div>
          <div v-for="(data, label) in userStats" :key="label" class="profile__card">
            <div>{{ label }}</div>
            <div>{{ data }}</div>
          </div>
        </div>
      </div>
      <div class="profile__section">
        <h2 class="text-center">Points this week</h2>
        <div class="profile__legends">
          <div
            class="profile__legend"
            v-for="(legendValue, index) of legend"
            :key="`legend${index}`"
          >
            <span :style="{ 'background-color': legendValue.color }" />
            <span>{{ legendValue.label }} [{{ legendValue.points }}]</span>
          </div>
        </div>
        <chart-line v-if="chartData" :data="chartData" :options="{ responsive: true }" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import UserService from '@/services/UserService'
import type { User } from '@/types/User'
import { defineComponent } from 'vue'
import { Line as ChartLine } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  type ChartData
} from 'chart.js'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import RankWidget from '@/components/widgets/RankWidget.vue'
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)
import { useToast } from 'vue-toastification'

const toast = useToast()

export default defineComponent({
  components: {
    ChartLine,
    RankWidget
  },
  data() {
    return {
      user: null as User | null,
      loading: true as boolean,
      chartData: {} as ChartData,
      legend: [] as any[],
      userStats: {} as Record<string, any>
    }
  },
  async mounted() {
    this.loading = true
    const username: string = this.$route.params.username as string
    if (!username) {
      return
    }

    try {
      const response: any = await UserService.getUserByUsername(username)
      this.user = response.user
    } catch (error: any) {
      toast.error(`User ${username} does not exist`)
    }

    if (!this.user) {
      this.$router.push({ path: '/not-found' })
      return
    }

    const statistics: any = await UserService.getUserStatistics(this.user.userId.toString())
    const currentUserStatistics: any =
      this.currentUser && this.currentUser.username !== username
        ? await UserService.getUserStatistics(this.currentUser.userId.toString())
        : null

    this.userStats = {
      'Total points': this.user.points,
      'Total games played': statistics.totalGamesPlayed,
      'Total games won': statistics.totalGamesWon,
      'Online games played': statistics.onlineGamesPlayed,
      'Online games won': statistics.onlineGamesWon,
      'Leaderboard position': statistics.leaderboardPosition
    }

    this.legend.push({
      color: '#be0afa',
      label: this.currentUser && this.currentUser.username === username ? 'You' : username,
      points: statistics.weekPoints ?? 0
    })

    if (currentUserStatistics) {
      this.legend.push({
        color: '#cdd8de',
        label: 'You',
        points: currentUserStatistics.weekPoints ?? 0
      })
    }

    this.chartData = {
      labels: statistics.pointsByDay.map((data: any) => data.date),
      datasets: [
        {
          tension: 0.3,
          borderColor: '#be0afa',
          data: statistics.pointsByDay.map((data: any) => data.points)
        },
        ...(currentUserStatistics
          ? [
              {
                tension: 0.3,
                borderColor: '#cdd8de',
                data: currentUserStatistics.pointsByDay.map((data: any) => data.points)
              }
            ]
          : [])
      ]
    }

    this.loading = false
  },
  computed: {
    ...mapState(useUserStore, { currentUser: 'user' })
  },
  methods: {
    formatDate(value: string) {
      const date: Date = new Date(value)

      if (!isNaN(date.getTime()) && typeof value === 'string') {
        return date.toLocaleString()
      }

      return value
    }
  }
})
</script>

<style scoped lang="scss">
@import '../assets/styles/_variables';

.profile {
  max-width: 450px;
  margin: 0 auto;

  &__section {
    padding: 15px 0;
    border-top: 1px solid $cl-text;

    h2 {
      margin-bottom: 10px;
    }
  }

  &__loading {
    height: 700px;
  }

  &__statistics {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 5px;
  }

  &__card {
    border: solid 1px $cl-secondary;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 5px;
    border-radius: 10px;
    width: 49%;

    div:first-child {
      opacity: 0.5;
    }

    div:last-child {
      display: flex;
      align-items: center;
      font-weight: bold;
    }
  }

  &__legends {
    padding-left: 10px;
    display: flex;
    gap: 10px;
  }

  &__legend {
    span:first-child {
      border-radius: 4.5px;
      padding: 0;
      width: 9px;
      height: 9px;
      display: inline-block;
      margin-right: 3px;
    }
  }
}
</style>
