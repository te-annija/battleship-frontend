<!-- 
  FILENAME: LeaderboardPage.vue
  DESCRIPTION: The component serves as the main container for leaderboard page in the route '/leadeboard'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="leaderboard container">
    <div class="box-shadow card">
      <h1 class="text-center">Leaderboard</h1>
      <leaderboard-widget :limit="100" />
    </div>
  </div>
</template>
<script lang="ts">
import LeaderboardWidget from '@/components/widgets/LeaderboardWidget.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    LeaderboardWidget
  }
})
</script>

<style scoped lang="scss">
.leaderboard {
  max-width: 505px;
  height: 65vh;

  h1 {
    margin-bottom: 10px;
  }
}
</style>
