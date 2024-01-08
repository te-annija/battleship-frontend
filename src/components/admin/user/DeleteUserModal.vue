<!-- 
  FILENAME: DeleteUserModal.vue
  DESCRIPTION: Admin panel modal used for deleting an user entity.
  AUTHOR: Annija Karitone 
-->
<template>
  <modal-template
    :isOpen="isOpen"
    :titleText="titleText"
    actionText="Yes"
    @submitForm="deleteUser"
    @cancel="$emit('cancel')"
  >
  </modal-template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ModalTemplate from '@/components/admin/template/ModalTemplate.vue'
import userService from '@/services/UserService'
import { useToast } from 'vue-toastification'
import type { PropType } from 'vue'
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
      return this.user ? `Are you sure you want to delete user [${this.user.username}]` : 'Error'
    }
  },
  methods: {
    async deleteUser() {
      try {
        await userService.deleteUser(this.user.userId.toString())
        toast.success('User deleted successfully')
        this.$emit('afterDelete')
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }
})
</script>
@/services/UserService
