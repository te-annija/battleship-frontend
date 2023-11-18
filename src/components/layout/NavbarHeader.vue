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

        <div class="navbar__top-account box-shadow">
          <img
            alt="Account"
            class="navbar__top-account-image"
            src="@/assets/icons/account.svg"
            width="35"
            height="35"
          />
          <div>Username123</div>
          <img
            alt="Open"
            class="navbar__top-account-open"
            src="@/assets/icons/open.svg"
            width="35"
            height="35"
          />
        </div>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import { RouterLink } from 'vue-router'
import { defineComponent } from 'vue'
import CookieService from '@/services/CookieService'

export default defineComponent({
  components: {
    RouterLink
  },
  data() {
    return {
      cookieService: new CookieService() as CookieService,
      isLightTheme: false as boolean
    }
  },
  watch: {
    isLightTheme(val) {
      const theme: string = val ? 'light' : 'dark'
      this.cookieService.setTheme(theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  },
  mounted() {
    let theme: string = this.cookieService.getTheme() ?? ''

    if (theme === '') {
      theme =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    }

    document.documentElement.setAttribute('data-theme', theme)
    this.isLightTheme = theme === 'light'
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
    margin-bottom: 50px;
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
    gap: 10px;
  }

  &-account {
    background: transparentize($cl-secondary, 0.4);
    border: solid 2px $cl-primary;
    min-width: 150px;
    width: fit-content;
    height: 27px;
    border-radius: 20px;
    border-left: none;
    display: flex;
    align-items: center;
    gap: 5px;
    color: $cl-text;

    &-image {
      object-fit: cover;
      border-radius: 50%;
      background: $cl-bg-navbar-account;
    }

    &-open {
      width: 15px;
      height: 15px;
      margin-left: auto;
      margin-right: 10px;
      cursor: pointer;
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
</style>
