<!-- 
  FILENAME: CreateRankrModal.vue
  DESCRIPTION: Admin panel modal used for creating a new rank entity.
  AUTHOR: Annija Karitone 
-->
<template>
  <modal-template
    :isOpen="isOpen"
    titleText="Create New Rank"
    actionText="Create"
    @submitForm="createRank"
    @cancel="$emit('cancel')"
  >
    <FormKit
      type="text"
      name="title"
      id="title"
      label="Title"
      validation="required"
      help="Title for the rank."
    />
    <FormKit
      type="file"
      name="icon"
      id="icon"
      label="Rank icon"
      validation="required"
      help="The icon to be asociated with the rank."
      @change="handleFileUpload"
    />
    <FormKit
      type="select"
      name="difficulty"
      id="difficulty"
      label="Difficulty Level"
      :options="['1', '2', '3', '4', '5', '6', '7']"
      validation="required"
      help="Difficulty level for the rank (1 to 7)"
    />
    <FormKit
      type="number"
      name="minimumPoints"
      id="minimumPoints"
      label="Minimum Points"
      validation="required|isInt|min:0"
      help="Minimum points required for the rank (>= 0)"
    />
  </modal-template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ModalTemplate from '@/components/admin/template/ModalTemplate.vue'
import rankService from '@/services/RankService'
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
  data() {
    return {
      image: null
    }
  },
  methods: {
    async createRank(values: any) {
      if (!this.image) return
      try {
        const formData = new FormData()
        formData.append('icon', this.image)
        formData.append('title', values.title)
        formData.append('minimumPoints', values.minimumPoints)
        formData.append('difficulty', values.difficulty)

        const response: any = await rankService.createRank(formData)
        toast.success(response.message)
        this.$emit('afterCreate')
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    handleFileUpload(event: any) {
      const file = event.target.files[0]
      this.image = file
    }
  }
})
</script>
