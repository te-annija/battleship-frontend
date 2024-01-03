<!-- 
  FILENAME: UserManagement.vue
  DESCRIPTION: Admin panel componenet that renders a list of all users.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="user__management card-admin">
    <table-templete
      :data="users"
      :table-headers="[
        { label: 'User ID', field: 'userId', filterValue: '', inputType: 'search' },
        { label: 'Username', field: 'username', filterValue: '', inputType: 'search' },
        { label: 'Email', field: 'email', filterValue: '', inputType: 'search' },
        { label: 'Points', field: 'points', filterValue: '', inputType: 'search' },
        { label: 'Rank ID', field: 'rankId', filterValue: '', inputType: 'search' },
        { label: 'Created At', field: 'createdAt', filterValue: '', inputType: 'date' },
        { label: 'Updated At', field: 'updatedAt', filterValue: '', inputType: 'date' },
        { label: 'Block Expires', field: 'blockExpiresAt', filterValue: '', inputType: 'date' },
        { label: 'Deleted At', field: 'deletedAt', filterValue: '', inputType: 'date' }
      ]"
      @showCreate="handleCreate"
      @showEdit="handleEdit"
      @showDelete="handleDelete"
      @sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Modify user data popup modals. -->
    <edit-user-modal
      :user="user"
      :isOpen="showEdit"
      @afterUpdate="handleAfterAction()"
      @cancel="handleCancel()"
    />
    <create-user-modal
      :isOpen="showCreate"
      @afterCreate="handleAfterAction()"
      @cancel="handleCancel()"
    >
    </create-user-modal>
    <delete-user-modal
      :isOpen="showDelete"
      :user="user"
      @afterDelete="handleAfterAction()"
      @cancel="handleCancel()"
    ></delete-user-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserService from '@/services/UserService'
import TableTemplete from './template/TableTemplete.vue'
import EditUserModal from './user/EditUserModal.vue'
import CreateUserModal from './user/CreateUserModal.vue'
import DeleteUserModal from './user/DeleteUserModal.vue'

import { useToast } from 'vue-toastification'
import { type User } from '@/types/User'

const toast = useToast()

export default defineComponent({
  data() {
    return {
      users: [] as User[],
      user: undefined as User | undefined,
      showEdit: false,
      showCreate: false,
      showDelete: false,
      sortField: '',
      sortOrder: 'asc',
      filterParams: ''
    }
  },
  components: {
    EditUserModal,
    CreateUserModal,
    DeleteUserModal,
    TableTemplete
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        this.users = await UserService.getUsers(
          this.filterParams,
          this.sortField,
          this.sortOrder,
          false
        )
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    handleCreate() {
      this.showCreate = true
    },
    handleEdit(user: User) {
      this.showEdit = true
      this.user = user
    },
    handleDelete(user: User) {
      this.showDelete = true
      this.user = user
    },
    handleSort(sortField: string, sortOrder: string) {
      this.sortField = sortField
      this.sortOrder = sortOrder
      this.fetchUsers()
    },
    handleFilter(filterParams: string) {
      this.filterParams = filterParams
      this.fetchUsers()
    },
    handleAfterAction() {
      this.handleCancel()
      this.fetchUsers()
    },
    handleCancel() {
      this.user = undefined
      this.showEdit = false
      this.showDelete = false
      this.showCreate = false
    }
  }
})
</script>
