<!-- 
  FILENAME: DeleteRankModal.vue
  DESCRIPTION: Admin panel modal used for deleting a rank entity.
  AUTHOR: Annija Karitone 
-->
<template>
  <modal-template
    :isOpen="isOpen"
    :titleText="titleText"
    actionText="Yes"
    @submitForm="deleteRank"
    @cancel="$emit('cancel')"
  >
  </modal-template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ModalTemplate from '@/components/admin/template/ModalTemplate.vue'
import rankService from '@/services/RankService'
import { useToast } from 'vue-toastification'
import type { PropType } from 'vue'
import type { Rank } from '@/types/Rank'

const toast = useToast()

export default defineComponent({
  components: {
    ModalTemplate
  },
  props: {
    rank: {
      type: Object as PropType<Rank>,
      default: null
    },
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    titleText() {
      return this.rank ? `Are you sure you want to delete rank [${this.rank.title}]` : 'Error'
    }
  },
  methods: {
    async deleteRank() {
      try {
        await rankService.deleteRank(this.rank.rankId.toString())
        toast.success('Rank deleted successfully')
        this.$emit('afterDelete')
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }
})
</script>
