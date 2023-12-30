<!-- 
  FILENAME: MainFooter.vue
  DESCRIPTION: The component renders footer at the bottom of the page
  AUTHOR: Annija Karitone 
-->
<template>
  <footer>
    <p class="text-center">
      {{ getCopyright }}, <a :href="`mailto:${getEmailAddress}`">{{ getEmailAddress }}</a>
    </p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    getCopyright() {
      return import.meta.env.VITE_COPYRIGHT
    },
    getEmailAddress() {
      return import.meta.env.VITE_EMAIL
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_variables';
footer {
  background-color: $cl-bg-navbar-account;
  padding: 5px 20px;
  min-height: 35px;
  width: 100%;
}
</style>
