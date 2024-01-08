<!-- 
  FILENAME: NavbarHeader.vue
  DESCRIPTION: The component renders navbar with main links on the top of the page.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="navbar-wrapper box-shadow">
    <nav class="navbar">
      <router-link to="/">
        <img alt="Battleship logo" class="logo" src="@/assets/logo.svg" width="75" height="45" />
      </router-link>
      <div class="navbar__links">
        <router-link to="/game">Battleship Game</router-link>
        <router-link to="/rules">Rules</router-link>
      </div>

      <div class="navbar__right">
        <theme-widget />
        <account-widget v-if="user" :user="user">
          <div v-if="user.role"><router-link to="/admin">Admin Panel</router-link></div>
          <div><router-link :to="`/user/${user.username}`">Profile</router-link></div>
          <div><router-link to="/leaderboard">Leaderboard</router-link></div>
          <div><router-link to="/settings">Settings</router-link></div>
          <div><router-link to="/history">Game history</router-link></div>
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
  data() {
    return {
      showMenu: false as boolean
    }
  },
  computed: {
    ...mapState(useUserStore, ['user'])
  },
  mounted() {
    this.$router.afterEach(() => {
      this.showMenu = false // Close the menu on route change
    })
  }
})
</script>
<style scoped lang="scss">
@import '../../assets/styles/_variables';
.navbar {
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 16px;

  &-wrapper {
    z-index: 100;
    position: fixed;
    width: 100%;
    height: 60px;
    background-color: $cl-bg-navbar;
    border-bottom: solid 2px $cl-primary;
  }

  &__links {
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 20px;

    a {
      color: $cl-text;
      text-transform: uppercase;
      text-decoration: none;

      &:hover,
      &.router-link-exact-active {
        border-bottom: solid 1px $cl-primary;
      }
    }
  }

  &__right {
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

@media only screen and (max-width: 600px) {
  .navbar {
    height: 50px;
    font-size: 14px;

    &__links {
      padding: 0 10px;
      gap: 10px;
    }

    &-wrapper {
      height: 50px;
    }
  }
  .logo {
    max-width: 50px;
  }
}
</style>
