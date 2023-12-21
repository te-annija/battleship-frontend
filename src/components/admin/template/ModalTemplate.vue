<!-- 
  FILENAME: ModalTemplate.vue
  DESCRIPTION: Template for admin panel form popups.
  AUTHOR: Annija Karitone 
-->
<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <h3 class="text-center">{{ titleText }}</h3>
      <FormKit type="form" :actions="false" @submit="handleSubmit">
        <slot></slot>
        <div class="modal-buttons">
          <button type="submit">{{ actionText }}</button>
          <button @click="$emit('cancel')">Cancel</button>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    isOpen: {
      type: Boolean as PropType<Boolean>,
      required: true
    },
    actionText: {
      type: String as PropType<String>,
      default: 'Save Changes'
    },
    titleText: {
      type: String as PropType<String>,
      default: ''
    }
  },
  methods: {
    handleSubmit(values: any) {
      this.$emit('submitForm', values)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/_variables';
/* Styles for Create User Modal */
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $cl-bg-admin-overlay;
  display: flex;
  justify-content: center;
  align-items: center;

  &-content {
    background-color: $cl-bg;
    padding: 30px 40px;
    min-width: 300px;
    border-radius: 5px;
  }

  &-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    button {
      margin-left: 10px;
    }
  }
}
</style>
