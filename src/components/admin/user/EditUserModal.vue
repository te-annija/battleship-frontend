<!-- 
  FILENAME: EditUserModal.vue
  DESCRIPTION: Admin panel modal used for editing an user entity.
  AUTHOR: Annija Karitone 
-->
<template>
  <modal-template
    :isOpen="isOpen"
    :titleText="titleText"
    actionText="Save User"
    @submitForm="updateUser"
    @cancel="$emit('cancel')"
  >
    <FormKit type="hidden" number name="userId" :value="user.userId" />
    <div v-if="!user.deletedAt">
      <FormKit
        type="text"
        name="username"
        id="username"
        label="Username"
        validation="required|length:3,32"
        help="Make sure to nofity user about the new username."
        :value="user.username"
      />
      <FormKit
        type="email"
        name="email"
        id="email"
        label="Email"
        validation="required|length:3,64|email"
        help="User email address."
        :value="user.email"
      />
      <FormKit
        type="date"
        name="blockExpiresAt"
        label="Block User"
        help="Enter date when should the block expire. Leave empty to unblock."
        :value="getDate(user.blockExpiresAt)"
      />
      <FormKit
        type="checkbox"
        name="role"
        label="Is Admin"
        help="Gives user admin previleges if checked."
        :value="user.role"
      />
    </div>
    <div v-else>
      <FormKit
        type="checkbox"
        name="restore"
        label="Re-activate user"
        help="Activates deleted user if checked."
      />
    </div>
  </modal-template>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import ModalTemplate from '@/components/admin/template/ModalTemplate.vue'
import userService from '@/services/UserService'
import { useToast } from 'vue-toastification'
import type { User } from '@/types/User'

const toast = useToast()

export default defineComponent({
  components: {
    ModalTemplate
  },
  props: {
    user: {
      type: Object as PropType<User>,
      default: null
    },
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    titleText() {
      return this.user ? `Edit User [${this.user.username}]` : 'Edit User'
    }
  },
  methods: {
    async updateUser(values: any) {
      try {
        if (values.restore) {
          const data: any = await userService.restore(values.userId)
          toast.success(data.message)
        } else {
          const data: any = await userService.updateUser(values)
          toast.success(data.message)
        }
        this.$emit('afterUpdate')
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    getDate(date: string) {
      return date ? new Date(date).toISOString().split('T')[0] : ''
    }
  }
})
</script>
@/services/UserService
