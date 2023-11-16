<!-- 
  FILENAME: StatusCirle.vue
  DESCRIPTION: The component renders a circle that represents status - green or red.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="status">
    <span
      class="status-circle"
      :class="{
        'status-circle-green': isStatusGreen,
        'status-circle-red': isStatusRed
      }"
    />
    <span class="status-text">{{ statusText }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    statusTextDefault: {
      type: String as PropType<String>,
      default: ''
    },
    isStatusGreen: {
      type: Boolean as PropType<Boolean>,
      default: false
    },
    statusGreenText: {
      type: String as PropType<String>,
      default: ''
    },
    isStatusRed: {
      type: Boolean as PropType<Boolean>,
      required: false
    },
    statusRedText: {
      type: String as PropType<String>,
      default: ''
    }
  },
  computed: {
    statusText() {
      return this.isStatusRed
        ? this.statusRedText
        : this.isStatusGreen
        ? this.statusGreenText
        : this.statusTextDefault
    }
  }
})
</script>
<style lang="scss" scoped>
.status {
  display: inline-block;

  &-circle {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    transition: background-color 0.5s ease;

    &-green {
      background-color: #4cd06d;
    }

    &-red {
      background-color: red;
    }
  }

  &-text {
    visibility: hidden;
    padding: 1px 2px;
    background-color: rgba(245, 242, 242, 0.8);
    border: 1px solid #d1bfbf;
    text-align: center;
    border-radius: 5px;
    white-space: nowrap;

    transition: visibility 2s ease-in;
  }

  &:hover &-text {
    visibility: visible;
    transition-delay: 0.3s;
  }
}
</style>
