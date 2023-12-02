<!-- 
  FILENAME: App.vue
  DESCRIPTION: The component serves as the main container for the app.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="app">
    <div class="wrapper" v-if="!isAdminPage">
      <navbar-header />
      <div class="background" />
      <main class="main">
        <router-view />
      </main>
    </div>
    <router-view v-else />
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
  },
  computed: {
    isAdminPage() {
      return this.$route.name ? this.$route.name.toString().includes('admin') : false
    }
  }
})
</script>
<style lang="scss" scoped>
@import './assets/styles/_variables';
.app {
  height: 100vh;
}
.background {
  z-index: -5;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url(assets/bg.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.main {
  width: 100%;
  height: calc(100% - 60px);
  padding-top: 50px;
  background: $cl-bg-overlay;
}

.wrapper {
  height: 100%;
}
</style>
