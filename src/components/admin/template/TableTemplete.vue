<!-- 
  FILENAME: TableTemplate.vue
  DESCRIPTION: Template for admin panel table display.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="management">
    <div class="management__actions">
      <button @click="$emit('showCreate')">Create New</button>
    </div>
    <div class="management__table">
      <table>
        <thead>
          <tr>
            <th v-for="header in localTableHeaders" :key="header.field">
              <div>
                {{ header.label }}
                <sorting-widget
                  :is-active="sortField === header.field"
                  :is-ascending="sortOrder === 'asc'"
                  @click="sort(header.field)"
                />
              </div>
              <input v-model="header.filterValue" :type="header.inputType" @input="applyFilters" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entity in paginatedEntity" :key="entity.id">
            <td v-for="header in localTableHeaders" :key="header.field">
              <img v-if="header.inputType === 'img'" :src="entity[header.field]" height="30" />
              <span v-else>{{ formatCellValue(entity[header.field]) }}</span>
            </td>
            <td class="management__table-actions">
              <button @click="$emit('showEdit', entity)">Edit</button>
              <button class="btn-red" @click="$emit('showDelete', entity)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="management__pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import SortingWidget from '@/components/widgets/SortingWidget.vue'
import type { User } from '@/types/User'
import type { Rank } from '@/types/Rank'

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<User[] | Rank[]>,
      required: true
    },
    tableHeaders: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1 as Number,
      pageSize: 10 as Number,
      sortField: '' as String,
      sortOrder: 'asc' as String,
      filterParams: '' as String,
      localTableHeaders: this.tableHeaders as any[]
    }
  },
  components: {
    SortingWidget
  },
  computed: {
    totalPages(): number {
      return Math.ceil(this.data.length / Number(this.pageSize))
    },
    paginatedEntity(): any {
      const startIndex = (Number(this.currentPage) - 1) * Number(this.pageSize)
      const endIndex = Number(startIndex) + Number(this.pageSize)
      return this.data.slice(startIndex, endIndex)
    }
  },
  methods: {
    formatCellValue(value: any) {
      if (!value) return '-'

      const date: Date = new Date(value)

      if (!isNaN(date.getTime()) && typeof value === 'string') {
        return date.toLocaleString()
      }

      return value
    },
    previousPage() {
      if (Number(this.currentPage) > 1) {
        this.currentPage = Number(this.currentPage) - 1
      }
    },
    nextPage() {
      if (Number(this.currentPage) < Number(this.totalPages)) {
        this.currentPage = Number(this.currentPage) + 1
      }
    },
    sort(field: string) {
      if (this.sortField === field) {
        if (this.sortOrder === 'desc') {
          this.sortField = ''
        }

        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
      this.$emit('sort', this.sortField, this.sortOrder)
    },
    async applyFilters() {
      this.filterParams = this.localTableHeaders
        .filter((header: any) => header.filterValue !== '')
        .map((header: any) => `${header.field}:${header.filterValue}`)
        .join(',')
      this.$emit('filter', this.filterParams)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/_variables';

.management {
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  &__actions {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }

  &__table {
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
    &-actions {
      height: 100%;
      align-items: center;
      display: flex;
      gap: 5px;
    }
  }
  &__pagination {
    padding-top: 10px;
    display: flex;
    gap: 5px;
  }
}
</style>
