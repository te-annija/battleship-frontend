<!-- 
  FILENAME: CreateUserModal.vue
  DESCRIPTION: Admin panel modal used for creating a new user entity.
  AUTHOR: Annija Karitone 
-->
<template>
  <modal-template
    :isOpen="isOpen"
    titleText="Create New User"
    actionText="Create"
    @submitForm="createUser"
    @cancel="cancelCreateUser"
  >
    <FormKit
      type="text"
      name="username"
      id="username"
      label="Username"
      validation="required|length:1,32"
      help="Unique username. Will be displayed publicly."
    />
    <FormKit
      type="email"
      name="email"
      id="email"
      label="Email"
      validation="required|length:1,64|email"
      help="User email address."
    />
    <FormKit
      type="password"
      name="password"
      label="Password"
      validation="required|length:8"
      help="Secret password. Make sure user change this after creation."
    />
    <FormKit
      type="checkbox"
      name="role"
      label="Is Admin"
      help="Gives user admin previleges if checked."
    />
  </modal-template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ModalTemplate from '@/components/admin/template/ModalTemplate.vue'
import userService from '@/services/UserService'
import { useToast } from 'vue-toastification'

const toast = useToast()

export default defineComponent({
  components: {
    ModalTemplate
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    async createUser(values: any) {
      try {
        await userService.createUser(values)
        toast.success('User created successfully')
        this.$emit('afterCreate')
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    cancelCreateUser() {
      this.$emit('cancel')
    }
  }
})
</script>
@/services/UserService
