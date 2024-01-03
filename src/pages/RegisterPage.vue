<!-- 
  FILENAME: RegisterPage.vue
  DESCRIPTION: The component serves as the main container for user registration in the route '/register'.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="register container">
    <div class="card box-shadow">
      <FormKit type="form" :actions="false" @submit="onSumbit">
        <h2 class="text-center">CREATE ACCOUNT</h2>
        <FormKit
          type="text"
          name="username"
          id="username"
          label="Username"
          validation="required|length:3,16"
          help="Your unique username. Will be displayed publicly."
        />
        <FormKit
          type="email"
          name="email"
          id="email"
          label="Email"
          validation="required|length:3,64|email"
          help="Your email address. We will contact you to this address if necessary."
        />
        <FormKit
          type="password"
          name="password"
          label="Password"
          validation="required|length:8"
          help="Your password. Make sure to not share your password with anyone."
        />
        <FormKit
          type="password"
          name="password_confirm"
          label="Confirm Password"
          validation="required|confirm"
          help="Confirm previously defined password."
          validation-label="Password confirmation"
        />
        <button type="submit">Register</button>
      </FormKit>
      <div class="text-center">
        Already have an account? <RouterLink to="/login" class="link">Login Here </RouterLink>
      </div>
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
    ...mapActions(useUserStore, ['register']),
    async onSumbit(values: any) {
      values.confirm = values.password_confirm
      await this.register(values)
    }
  }
})
</script>

<style lang="scss" scoped>
.register {
  max-width: 500px;
}
</style>
