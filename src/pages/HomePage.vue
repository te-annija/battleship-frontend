<!-- 
  FILENAME: HomePage.vue
  DESCRIPTION: The component serves as the main container for home page in the route '/'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="homepage">
    <div class="container">
      <p>
        Step into the game of Battleship, a game rooted in history since World War I, where the
        ultimate challenge awaits: Can you secure victory by strategically sinking their fleet
        before they dismantle yours?
      </p>
      <p class="homepage__accent"><router-link to="/game">Play Now</router-link></p>

      <p>Best admirals</p>
      <leaderboard-widget :limit="5" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LeaderboardWidget from '@/components/widgets/LeaderboardWidget.vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  components: {
    RouterLink,
    LeaderboardWidget
  },
  computed: {
    getEmailAddress() {
      return import.meta.env.VITE_EMAIL
    }
  }
})
</script>
<style scoped lang="scss">
@import '../assets/styles/_variables';
.homepage {
  width: 100%;
  padding: 30px;
  margin-top: 20px;
  background: $cl-bg-homepage;

  p {
    font-size: 20px;
    text-transform: uppercase;
    text-align: center;
  }

  &__accent {
    font-weight: bold;
    font-size: 30px !important;
    padding-bottom: 25px;
  }
}
</style>
