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
      <main-footer />
    </div>
    <router-view v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import NavbarHeader from '@/components/layout/NavbarHeader.vue'
import MainFooter from './components/layout/MainFooter.vue'
import './assets/styles/app.scss'

export default defineComponent({
  components: {
    RouterView,
    NavbarHeader,
    MainFooter
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
  position: fixed;
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
  height: fit-content;
  min-height: calc(100% - 35px);
  padding: 80px 0 20px 0;
  background: $cl-bg-overlay;
}

.wrapper {
  height: 100vh;
}
</style>
