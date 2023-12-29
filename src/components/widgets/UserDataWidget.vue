<!-- 
  FILENAME: UserDataWidget.vue
  DESCRIPTION: The component renders formated user information.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="user">
    <RankWidgetVue class="user__rank" v-if="rank" :rank="rank" />
    <div>
      <div class="opacity">{{ text }}</div>
      <router-link v-if="isUser" :to="`/user/${username}`"> {{ username }}</router-link>
      <div v-else>{{ username }}</div>
      <div><slot></slot></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Rank } from '@/types/Rank'
import RankWidgetVue from './RankWidget.vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  components: { RankWidgetVue, RouterLink },
  props: {
    rank: {
      type: Object as PropType<Rank | null>,
      default: null
    },
    text: {
      type: String as PropType<String>,
      default: ''
    },
    username: {
      type: String as PropType<String>,
      required: true
    },
    isUser: {
      type: Boolean as PropType<Boolean>,
      default: false
    }
  },
  computed: {
    imgPath() {
      if (!this.rank) {
        return ''
      }
      return `${import.meta.env.VITE_SERVER_URL}${this.rank.icon}`
    }
  }
})
</script>
<style scoped lang="scss">
.user {
  display: flex;
  &__rank {
    height: 30px;
  }

  div {
    line-height: 16px;
  }
  a {
    text-decoration: underline;

    &:hover {
      color: blue;
    }
  }
}
</style>
