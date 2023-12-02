<!-- 
  FILENAME: SortingWidget.vue
  DESCRIPTION: The component renders arrows used for the sorting of records.
  AUTHOR: Annija Karitone 
-->
<template>
  <span class="sorting">
    <img
      v-if="isActive"
      class="sorting-arrow"
      :class="{ arrow__desc: !isAscending }"
      alt="▲"
      src="@/assets/icons/sort-asc.svg"
      height="8"
    />
    <img v-else alt="▼" src="@/assets/icons/sort.svg" height="13" />
  </span>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    isActive: {
      type: Boolean as PropType<Boolean>,
      default: false
    },
    isAscending: {
      type: Boolean as PropType<Boolean>,
      default: true
    }
  }
})
</script>
<style lang="scss" scoped>
.sorting {
  cursor: pointer;
  float: right;

  &-arrow {
    transition: transform 0.5s cubic-bezier(0, 0.96, 0.9, 1.21);

    &__desc {
      transform: rotate(180deg);
      transition: transform 0.5s cubic-bezier(0, 0.96, 0.9, 1.21);
    }
    &:not(&__desc) {
      transform: rotate(0deg);
    }
  }
}
html[data-theme='dark'] {
  img {
    filter: invert(100%);
  }
}
</style>
