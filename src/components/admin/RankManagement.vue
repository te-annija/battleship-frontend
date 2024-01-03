<!-- 
  FILENAME: RankManagement.vue
  DESCRIPTION: Admin panel componenet that renders a list of all ranks.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="user__management card-admin">
    <table-templete
      :data="ranks"
      :table-headers="[
        { label: 'Rank ID', field: 'rankId', filterValue: '', inputType: 'search' },
        { label: 'Title', field: 'title', filterValue: '', inputType: 'search' },
        { label: 'Icon', field: 'icon', filterValue: '', inputType: 'img' },
        { label: 'Difficulty', field: 'difficulty', filterValue: '', inputType: 'search' },
        { label: 'Min Points', field: 'minimumPoints', filterValue: '', inputType: 'search' },
        { label: 'Created At', field: 'createdAt', filterValue: '', inputType: 'date' },
        { label: 'Updated At', field: 'updatedAt', filterValue: '', inputType: 'date' },
        { label: 'Deleted At', field: 'deletedAt', filterValue: '', inputType: 'date' }
      ]"
      @showCreate="handleCreate"
      @showEdit="handleEdit"
      @showDelete="handleDelete"
      @sort="handleSort"
      @filter="handleFilter"
    />

    <!-- Modify rank data popup modals. -->
    <edit-rank-modal
      :rank="rank"
      :isOpen="showEdit"
      @afterUpdate="handleAfterAction()"
      @cancel="handleCancel()"
    />
    <create-rank-modal
      :isOpen="showCreate"
      @afterCreate="handleAfterAction()"
      @cancel="handleCancel()"
    />
    <delete-rank-modal
      :isOpen="showDelete"
      :rank="rank"
      @afterDelete="handleAfterAction()"
      @cancel="handleCancel()"
    ></delete-rank-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import rankService from '@/services/RankService'
import TableTemplete from './template/TableTemplete.vue'
import EditRankModal from './rank/EditRankModal.vue'
import CreateRankModal from './rank/CreateRankModal.vue'
import DeleteRankModal from './rank/DeleteRankModal.vue'

import { useToast } from 'vue-toastification'
import { type Rank } from '@/types/Rank'

import authService from '@/services/AuthService'

const toast = useToast()

export default defineComponent({
  data() {
    return {
      ranks: [] as Rank[],
      rank: undefined as Rank | undefined,
      showEdit: false,
      showCreate: false,
      showDelete: false,
      sortField: '',
      sortOrder: 'asc',
      filterParams: '',
      files: [],
      header: authService.authHeader()
    }
  },
  components: {
    EditRankModal,
    CreateRankModal,
    DeleteRankModal,
    TableTemplete
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        this.ranks = await rankService.getRanks(
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
    handleEdit(rank: Rank) {
      this.rank = rank
      this.showEdit = true
    },
    handleDelete(rank: Rank) {
      this.rank = rank
      this.showDelete = true
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
      this.rank = undefined
      this.showEdit = false
      this.showDelete = false
      this.showCreate = false
    }
  }
})
</script>
