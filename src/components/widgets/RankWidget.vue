<template>
  <img :src="imgPath" :alt="rank.title" :height="25" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Rank } from '@/types/Rank'

export default defineComponent({
  props: {
    rank: {
      type: Object as PropType<Rank>,
      required: true
    }
  },
  computed: {
    imgPath() {
      return `${import.meta.env.VITE_SERVER_URL}${this.rank.icon}`
    }
  }
})
</script>
