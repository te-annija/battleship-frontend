<!-- 
  FILENAME: LoginPage.vue
  DESCRIPTION: The component serves as the main container for user login in the route '/register'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="login container">
    <div class="box-shadow card">
      <FormKit type="form" :actions="false" @submit="onSumbit">
        <div class="text-center">
          <h2>WELCOME BACK!</h2>
          <p>Glad to see you again</p>
        </div>
        <FormKit type="text" name="username" id="username" label="Username" validation="required" />
        <FormKit type="password" name="password" label="Password" validation="required" />
        <button type="submit">Log in</button>
      </FormKit>

      <div class="text-center">New Here? <RouterLink to="/register" class="link">Register Here </RouterLink></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user'
import { mapActions } from 'pinia'
import { RouterLink } from 'vue-router'

export default defineComponent({
  components: {
    RouterLink
  },
  methods: {
    ...mapActions(useUserStore, ['login']),
    async onSumbit(values: any) {
      await this.login(values.username, values.password)
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  max-width: 500px;
}
</style>
