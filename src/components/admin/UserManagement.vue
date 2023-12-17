<!-- 
  FILENAME: UserManagement.vue
  DESCRIPTION: Admin panel componenet that renders a list of all users.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="user__management">
    <div class="user__management-actions">
      <button @click="showCreate = true" class="create-user-button">Create New User</button>
    </div>
    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header.field">
              <div>
                {{ header.label }}
                <sorting-widget
                  :is-active="sortField === header.field"
                  :is-ascending="sortOrder === 'asc'"
                  @click="sortUsers(header.field)"
                />
              </div>
              <input v-model="header.filterValue" :type="header.inputType" @input="applyFilters" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td v-for="header in tableHeaders" :key="header.field">
              {{ formatCellValue(user[header.field]) }}
            </td>
            <td class="action-buttons" v-if="displayActions(user)">
              <button @click="editUser(user)">Edit</button>
              <button class="btn-red" @click="deleteUser(user)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

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
import EditUserModal from './user/EditUserModal.vue'
import CreateUserModal from './user/CreateUserModal.vue'
import DeleteUserModal from './user/DeleteUserModal.vue'
import SortingWidget from '../widgets/SortingWidget.vue'

import { useToast } from 'vue-toastification'
import { type User } from '@/types/User'
import { useUserStore } from '@/stores/user'
import { mapState } from 'pinia'

const toast = useToast()

export default defineComponent({
  data() {
    return {
      users: [] as User[],
      user: undefined as User | undefined,
      showEdit: false,
      showCreate: false,
      showDelete: false,
      currentPage: 1,
      pageSize: 10,
      sortField: '',
      sortOrder: 'asc',
      filterParams: '',
      tableHeaders: [
        { label: 'User ID', field: 'id', filterValue: '', inputType: 'number' },
        { label: 'Username', field: 'username', filterValue: '', inputType: 'text' },
        { label: 'Created At', field: 'createdAt', filterValue: '', inputType: 'date' },
        { label: 'Updated At', field: 'updatedAt', filterValue: '', inputType: 'date' },
        { label: 'Block Expires', field: 'blockExpiresAt', filterValue: '', inputType: 'date' },
        { label: 'Deleted At', field: 'deletedAt', filterValue: '', inputType: 'date' }
      ]
    }
  },
  components: {
    EditUserModal,
    CreateUserModal,
    DeleteUserModal,
    SortingWidget
  },
  async mounted() {
    await this.fetchUsers()
  },
  computed: {
    ...mapState(useUserStore, {
      currentUser: 'user'
    }),
    totalPages(): number {
      return Math.ceil(this.users.length / this.pageSize)
    },
    paginatedUsers(): User[] {
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      return this.users.slice(startIndex, endIndex)
    }
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
    displayActions(user: User) {
      return this.currentUser && this.currentUser.id !== user.id && user.username !== 'admin'
    },
    async editUser(user: User) {
      this.showEdit = true
      this.user = user
    },
    async deleteUser(user: User) {
      this.showDelete = true
      this.user = user
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
    },
    formatCellValue(value: any) {
      if (!value) return '-'

      const date: Date = new Date(value)

      if (!isNaN(date.getTime()) && typeof value === 'string') {
        return date.toLocaleString()
      }

      return value
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    sortUsers(field: string) {
      if (this.sortField === field) {
        if (this.sortOrder === 'desc') {
          this.sortField = ''
        }

        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
      this.fetchUsers()
    },
    async applyFilters() {
      this.filterParams = this.tableHeaders
        .filter((header) => header.filterValue !== '')
        .map((header) => `${header.field}:${header.filterValue}`)
        .join(',')
      this.fetchUsers()
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_variables';

.user__management {
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  &-actions {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .user-table {
    overflow-x: auto;
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #ccc;

      tr {
        border-bottom: 1px solid #ccc;
      }

      th,
      td {
        padding: 8px;
        text-align: left;
        min-width: 100px;
        text-align: center;
        vertical-align: middle;
      }

      th {
        background: $cl-bg-admin;
        font-weight: bold;
        border: 1px solid #ccc;

        input {
          width: 100%;
          max-width: 200px;
        }
      }
    }
  }

  .action-buttons {
    height: 100%;
    align-items: center;
    display: flex;
    gap: 5px;
  }

  .pagination {
    padding-top: 10px;
    display: flex;
    gap: 5px;
  }
}
</style>
@/services/UserService
