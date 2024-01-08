<!-- 
  FILENAME: AccountWidget.vue
  DESCRIPTION: The component renders account image and username with options dropdown for header.
  AUTHOR: Annija Karitone 
-->
<template>
  <div v-if="user" class="account box-shadow">
    <div class="account-wrapper">
      <img
        alt="Account"
        class="account-image"
        src="@/assets/icons/account.svg"
        width="35"
        height="35"
      />
      <div class="account-user">{{ user.username }}</div>
      <img
        alt="Open"
        class="account-open"
        :class="{ 'account-opened': showDropdown }"
        src="@/assets/icons/open.svg"
        width="35"
        height="35"
        @click="toggleDropdown"
      />
    </div>
    <div v-if="showDropdown" class="account-dropdown box-shadow" @click="showDropdown = false">
      <slot> </slot>
      <div @click="logOutHandler">Log Out</div>
    </div>
    <div v-if="showDropdown" class="account-menu" @click="showDropdown = false">
      <div>
        {{ user.username }}
      </div>
      <slot> </slot>
      <div @click="logOutHandler">Log Out</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/User'
import { mapActions } from 'pinia'
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    }
  },
  data() {
    return {
      showDropdown: false
    }
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    logOutHandler() {
      this.logout()
      if (this.$route.path.includes('admin')) {
        this.$router.push('/')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables';
.account {
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
    transition: transform 0.5s cubic-bezier(0, 0.96, 0.9, 1.21);

    &:not(.account-opened) {
      transform: rotate(0deg);
    }
  }

  &-opened {
    transform: rotate(180deg);
    transition: transform 0.5s cubic-bezier(0, 0.96, 0.9, 1.21);
  }

  :deep(.account-dropdown) {
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

  :deep(.account-menu) {
    z-index: 99;
    display: none;
    position: fixed;
    top: 50px;
    left: 0px;
    height: 100%;
    width: 100%;
    background-color: $cl-bg-navbar;

    div {
      cursor: pointer;
      display: block;
      font-size: 20px;
      width: 100%;
      text-align: center;
      height: 30px;
      margin-top: 10px;

      &:hover {
        background: transparentize($cl-secondary, 0.6);
      }
    }
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

@media only screen and (max-width: 600px) {
  .account {
    background: none;
    box-shadow: none;
    border: none;
    min-width: auto;

    :deep(.account-dropdown) {
      display: none;
    }
    :deep(.account-menu) {
      display: block;
    }

    &-image,
    &-user {
      display: none;
    }
  }
}
</style>
