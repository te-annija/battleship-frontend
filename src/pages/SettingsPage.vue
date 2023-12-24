<!-- 
  FILENAME: SettingsPage.vue
  DESCRIPTION: The component serves as the main container for settings page in the route '/settings'. Allows to edit user profile information.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="settings">
    <div class="box-shadow card">
      <h1 class="text-center">SETTINGS</h1>

      <div class="settings-section" v-if="user">
        <FormKit type="form" :actions="false" @submit="onSubmit">
          <h3 class="text-center">Edit Profile</h3>
          <FormKit
            type="text"
            label="Username"
            :value="user.username"
            :ignore="true"
            :disabled="true"
            help="To change your username contact support and provide valid reasoning."
          />
          <div class="form-section">
            <FormKit
              type="password"
              name="password"
              label="Password"
              validation="length:8"
              placeholder="·  ·  ·  ·  ·  ·  ·"
              :disabled="!isEditPassword"
              help="Your password. Make sure to not share your password with anyone."
            />
            <FormKit
              v-if="isEditPassword"
              type="password"
              name="password_confirm"
              label="Confirm Password"
              validation="required|confirm"
              help="Confirm previously defined password."
              validation-label="Password"
              placeholder="·  ·  ·  ·  ·  ·  ·"
              :disabled="!isEditPassword"
            />
            <div class="form-change" @click="isEditPassword = !isEditPassword">
              <p>{{ !isEditPassword ? 'Change' : 'Cancel' }}</p>
            </div>
          </div>
          <button type="submit" :disabled="disableSubmit">Update Info</button>
        </FormKit>
      </div>
      <div class="settings-section" v-if="user">
        <h2 class="text-center">Deactivate account</h2>
        <div>
          Your account will no longer be visible to others. Your username will still be seen in the
          history.
        </div>

        <div class="settings-deactivate">
          <button class="btn-red" @click="showConfirmation = true">Deactivate</button>
          <div>To re-activate account contact support.</div>
        </div>
        <div v-if="showConfirmation" class="confirmation-dialog">
          <p>Are you sure you want to deactivate your account?</p>
          <button @click="confirmDeactivation">Yes</button>
          <button @click="showConfirmation = false">No</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  data() {
    return {
      isEditPassword: false as Boolean,
      showConfirmation: false as Boolean
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    disableSubmit(): boolean {
      return !this.isEditPassword
    }
  },
  methods: {
    ...mapActions(useUserStore, ['update', 'delete']),
    async onSubmit(values: any) {
      values.id = this.user ? this.user.id : -1
      await this.update(values)
      this.isEditPassword = false
    },
    async confirmDeactivation() {
      const userId: number = this.user ? this.user.id : -1
      await this.delete(userId)
      this.showConfirmation = false
    }
  }
})
</script>

<style scoped lang="scss">
@import '../assets/styles/_variables';

.settings {
  max-width: 450px;
  margin: 0 auto;

  &-section {
    margin-top: 10px;
    padding: 20px 0;
    border-top: 1px solid $cl-text;
  }

  .form {
    &-section {
      position: relative;
    }

    &-change {
      color: blue;
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      width: min-content;
      margin-left: auto;
    }
  }

  &-deactivate {
    display: flex;
    gap: 10px;
    align-items: center;

    div {
      opacity: 0.7;
      font-size: 0.9em;
    }
  }
}
</style>
