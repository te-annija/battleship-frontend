<!-- 
  FILENAME: NavbarHeader.vue
  DESCRIPTION: The component renders navbar with main links on the top of the page.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="navbar__top-wrapper box-shadow">
    <nav class="navbar__top">
      <RouterLink to="/">
        <img alt="Battleship logo" class="logo" src="@/assets/logo.svg" width="75" height="45" />
      </RouterLink>
      <div class="navbar__top-links">
        <RouterLink to="/game">Battleship Game</RouterLink>
        <RouterLink to="/tournaments">Tournaments</RouterLink>
      </div>

      <div class="navbar__top-right">
        <label class="navbar__top-theme_toggle">
          <input type="checkbox" v-model="isLightTheme" />
          <span class="navbar__top-theme_slider box-shadow"></span>
        </label>
        <div v-if="user" class="navbar__top-account box-shadow">
          <div class="navbar__top-account-wrapper">
            <img
              alt="Account"
              class="navbar__top-account-image"
              src="@/assets/icons/account.svg"
              width="35"
              height="35"
            />
            <div>{{ user.username }}</div>
            <img
              alt="Open"
              class="navbar__top-account-open"
              src="@/assets/icons/open.svg"
              width="35"
              height="35"
              @click="toggleDropdown"
            />
          </div>
          <div v-if="showDropdown" class="navbar__top-account-dropdown box-shadow">
            <div @click="logOutHandler">Log Out</div>
          </div>
        </div>
        <div v-else>
          <RouterLink to="/login"> Log In </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import { RouterLink } from 'vue-router'
import { defineComponent } from 'vue'
import cookieService from '@/services/cookie.service'
import { useUserStore } from '@/stores/user'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  components: {
    RouterLink
  },
  data() {
    return {
      isLightTheme: false as boolean,
      showDropdown: false
    }
  },
  watch: {
    isLightTheme(val) {
      const theme: string = val ? 'light' : 'dark'
      cookieService.setTheme(theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  },
  computed: {
    ...mapState(useUserStore, ['user'])
  },
  mounted() {
    let theme: string = cookieService.getTheme() ?? ''

    if (theme === '') {
      theme =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    }

    document.documentElement.setAttribute('data-theme', theme)
    this.isLightTheme = theme === 'light'
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    logOutHandler() {
      this.logout()
      this.showDropdown = false
    }
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

  a {
    color: $cl-text;
    text-transform: uppercase;

    &:hover,
    &.router-link-exact-active {
      border-bottom: solid 1px $cl-primary;
    }
  }

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
  }

  &-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &-account {
    background: $cl-bg-navbar-account;
    border: solid 2px $cl-primary;
    min-width: 150px;
    width: fit-content;
    border-radius: 20px;
    border-left: none;
    color: $cl-text;
    position: relative;

    &-wrapper {
      display: flex;
      align-items: center;
      gap: 5px;
      height: 27px;
    }

    &-image {
      object-fit: cover;
      border-radius: 50%;
      background: $cl-bg-navbar;
    }

    &-open {
      width: 15px;
      height: 15px;
      margin-left: auto;
      margin-right: 10px;
      cursor: pointer;
    }

    &-dropdown {
      position: absolute;
      left: 0px;
      top: 35px;
      min-width: 150px;
      background: $cl-bg-navbar-account;
      border: 1px solid $cl-text;
      border-radius: 5px;
      z-index: 10;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      animation: growDown 300ms ease-in-out forwards;
      transform-origin: top center;

      div {
        padding: 7px 10px;
        cursor: pointer;
        border-bottom: 1px solid $cl-text;

        &:hover {
          background: transparentize($cl-secondary, 0.6);
        }
      }
    }
  }

  &-theme_toggle {
    position: relative;
    display: inline-block;
    width: 47px;
    height: 27px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  &-theme_slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    background: transparentize($cl-secondary, 0.4);
    border: solid 3px $cl-primary;
    transition: 0.4s;
    border-radius: 14px;

    &:before {
      position: absolute;
      left: 1px;
      bottom: 1px;
      content: '';
      height: 19px;
      width: 19px;
      border-radius: 50%;
      transition: 0.4s;
      box-shadow: 0 0 7px $cl-deep-black;

      background: $cl-secondary url(../../assets/icons/dark-theme.svg) no-repeat center center fixed;
      background-size: 15px 15px;
      animation: going-right 0.4s cubic-bezier(0.57, 1.52, 0.64, 1) forwards;
    }

    input:checked + &:before {
      background: $cl-light-blue url(../../assets/icons/light-theme.svg) no-repeat center center
        fixed;
      background-size: 15px 15px;
      animation: going-left 0.4s cubic-bezier(0.57, 1.52, 0.64, 1) forwards;
      transition: all 0.4s;
    }
  }
}

@keyframes going-left {
  100% {
    -webkit-transform: translateX(20px);
  }
}

@keyframes going-right {
  0% {
    -webkit-transform: translateX(20px);
  }
  100% {
    -webkit-transform: translateX(0px);
  }
}

@keyframes growDown {
  0% {
    transform: scaleY(0);
  }
  80% {
    transform: scaleY(1.1);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>
