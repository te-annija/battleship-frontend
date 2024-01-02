<!-- 
  FILENAME: ThemeWidget.vue
  DESCRIPTION: The component renders a toggle block that changes the theme (dark or light) of the website.
  AUTHOR: Annija Karitone 
-->
<template>
  <label class="theme_toggle">
    <input type="checkbox" v-model="isLightTheme" />
    <span class="theme_slider box-shadow"></span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import cookieService from '@/services/CookieService'

export default defineComponent({
  data() {
    return {
      isLightTheme: false as boolean
    }
  },
  watch: {
    isLightTheme(val) {
      const theme: string = val ? 'light' : 'dark'
      cookieService.setTheme(theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
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
  }
})
</script>
<style lang="scss" scoped>
@import '../../assets/styles/_variables';

.theme_toggle {
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

.theme_slider {
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
    background: $cl-light-blue url(../../assets/icons/light-theme.svg) no-repeat center center fixed;
    background-size: 15px 15px;
    animation: going-left 0.4s cubic-bezier(0.57, 1.52, 0.64, 1) forwards;
    transition: all 0.4s;
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

@media only screen and (max-width: 600px) {
  .theme_toggle {
    width: 30px;
    height: 20px;
  }

  .theme_slider {
    border: solid 2px $cl-primary;
    border-radius: 10px;

    &:before {
      height: 15px;
      width: 15px;
      background-size: 10px 10px;
    }

    input:checked + &:before {
      background-size: 10px 10px;
    }
  }

  @keyframes going-left {
    100% {
      -webkit-transform: translateX(10px);
    }
  }

  @keyframes going-right {
    0% {
      -webkit-transform: translateX(10px);
    }
    100% {
      -webkit-transform: translateX(0px);
    }
  }
}
</style>
@/services/CookieService
