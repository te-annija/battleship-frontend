<!-- 
  FILENAME: NavbarHeader.vue
  DESCRIPTION: The component renders navbar with main links on the top of the page.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="navbar__top-wrapper box-shadow">
    <nav class="navbar__top">
      <router-link to="/">
        <img alt="Battleship logo" class="logo" src="@/assets/logo.svg" width="75" height="45" />
      </router-link>
      <div class="navbar__top-links">
        <router-link to="/game">Battleship Game</router-link>
        <router-link to="/tournaments">Tournaments</router-link>
      </div>

      <div class="navbar__top-right">
        <theme-widget />
        <account-widget v-if="user" :user="user">
          <div v-if="user.isAdmin"><router-link to="/admin">Admin Panel</router-link></div>
          <div><router-link to="/settings">Settings</router-link></div>
        </account-widget>
        <div v-else>
          <router-link to="/login"> Log In </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import { RouterLink } from 'vue-router'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user'
import { mapState } from 'pinia'
import ThemeWidget from '@/components/widgets/ThemeWidget.vue'
import AccountWidget from '@/components/widgets/AccountWidget.vue'

export default defineComponent({
  components: {
    RouterLink,
    ThemeWidget,
    AccountWidget
  },
  computed: {
    ...mapState(useUserStore, ['user'])
  }
})
</script>
<style scoped lang="scss">
@import '../../assets/styles/_variables';
.navbar__top {
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 16px;

  &-wrapper {
    width: 100%;
    height: 60px;
    background-color: $cl-bg-navbar;
    border-bottom: solid 2px $cl-primary;
  }

  &-links {
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 20px;

    a {
      color: $cl-text;
      text-transform: uppercase;

      &:hover,
      &.router-link-exact-active {
        border-bottom: solid 1px $cl-primary;
      }
    }
  }

  &-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;

    a {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
