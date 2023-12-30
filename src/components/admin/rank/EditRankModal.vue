<!-- 
  FILENAME: EditRankModal.vue
  DESCRIPTION: Admin panel modal used for editing a rank entity.
  AUTHOR: Annija Karitone 
-->
<template>
  <modal-template
    :isOpen="isOpen"
    :titleText="titleText"
    actionText="Save Rank"
    @submitForm="updateRank"
    @cancel="handleCancel"
  >
    <FormKit type="hidden" number name="id" :value="rank.id" />
    <div v-if="!rank.deletedAt">
      <FormKit
        type="text"
        name="title"
        id="title"
        label="Title"
        :value="rank.title"
        validation="required"
        help="Title for the rank."
      />
      <FormKit
        type="select"
        name="difficulty"
        id="difficulty"
        label="Difficulty Level"
        validation="required"
        :value="rank.difficulty.toString()"
        :options="['1', '2', '3', '4', '5', '6', '7']"
        help="Difficulty level for the rank (1 to 7)"
      />
      <FormKit
        type="number"
        name="minimumPoints"
        id="minimumPoints"
        label="Minimum Points"
        :value="rank.minimumPoints.toString()"
        validation="required|isInt|min:0"
        help="Minimum points required for the rank (>= 0)"
      />
      <div class="form-group">
        <div class="form-change" @click="isEditImage = !isEditImage">
          <p>{{ !isEditImage ? 'Change' : 'Cancel' }}</p>
        </div>
        <FormKit
          type="file"
          name="icon"
          id="icon"
          label="Rank icon"
          accept=".png, .svg"
          :value="[{ name: rank.icon }]"
          :disabled="!isEditImage"
          help="The icon to be asociated with the rank."
          @change="handleFileUpload"
        />
      </div>
    </div>
    <div v-else>
      <FormKit
        type="checkbox"
        name="restore"
        label="Re-activate rank"
        help="Activates deleted rank if checked."
      />
    </div>
  </modal-template>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import ModalTemplate from '@/components/admin/template/ModalTemplate.vue'
import rankService from '@/services/RankService'
import { useToast } from 'vue-toastification'
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
  data() {
    return {
      isEditImage: false as Boolean,
      image: null as File | null
    }
  },
  computed: {
    titleText() {
      return this.rank ? `Edit Rank [${this.rank.title}]` : 'Edit Rank'
    }
  },
  methods: {
    async updateRank(values: any) {
      try {
        if (values.restore) {
          const data: any = await rankService.restoreRank(values.id)
          toast.success(data.message)
        } else {
          const formData = new FormData()
          if (this.image && this.isEditImage) {
            formData.append('icon', this.image)
          }

          formData.append('title', values.title)
          formData.append('minimumPoints', values.minimumPoints)
          formData.append('difficulty', values.difficulty)
          const data: any = await rankService.updateRank(values.id, formData)
          toast.success(data.message)
        }

        this.$emit('afterUpdate')
      } catch (error: any) {
        toast.error(error.message)
      }
      this.isEditImage = false
    },
    handleFileUpload(event: any) {
      const file = event.target.files[0]
      this.image = file
    },
    handleCancel() {
      this.isEditImage = false
      this.$emit('cancel')
    }
  }
})
</script>
<style scoped lang="scss">
@import '../../../assets/styles/_variables';

.form-group {
  position: relative;
}

.form-change {
  color: $cl-deep-blue;
  cursor: pointer;
  z-index: 10;
  position: absolute;
  top: 0;
  right: 0;
  width: min-content;
  margin-left: auto;
}
</style>
