<!-- 
  FILENAME: App.vue
  DESCRIPTION: The component serves as the main container for the app.
  AUTHOR: Annija Karitone
-->
<template>
  <div>
    <navbar-header />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import './assets/styles/app.scss'

export default defineComponent({
  components: {
    RouterView,
    NavbarHeader
  }
})
</script>
<style lang="scss" scoped>
main {
  width: 100%;
}
</style>
