<!-- 
  FILENAME: AdminSidebar.vue
  DESCRIPTION: The component renders sidebar on admin page with links to admin components.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="admin__sidebar box-shadow" :class="{ 'admin__sidebar-collapsed': isCollapsed }">
    <img
      v-if="isCollapsed"
      class="admin__sidebar-collapse"
      alt="collapse"
      src="@/assets/icons/menu-expand.svg"
      width="25"
      @click="isCollapsed = false"
    />
    <img
      v-else
      class="admin__sidebar-collapse"
      alt="collapse"
      src="@/assets/icons/menu-collapse.svg"
      width="25"
      @click="isCollapsed = true"
    />
    <div class="admin__sidebar-logo">
      <img v-if="!isCollapsed" alt="Battleship logo" src="@/assets/logo.svg" :width="100" />
      <p v-if="!isCollapsed">BATTLESHIP GAME</p>
    </div>
    <ul>
      <li>
        <router-link to="/admin">
          <img alt="dashboard" src="@/assets/icons/dashboard.svg" width="20" />
          <span v-if="!isCollapsed">Overview </span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin/users">
          <img alt="dashboard" src="@/assets/icons/users.svg" width="20" />
          <span v-if="!isCollapsed">Users </span></router-link
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  components: {
    RouterLink
  },
  data() {
    return {
      isCollapsed: false
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/_variables';

.admin__sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  background: $cl-bg-admin;
  padding: 50px 0;
  border-right: solid 1px $cl-primary;
  z-index: 90;
  min-width: 250px;

  &-collapsed {
    min-width: 60px;
    max-width: 60px;

    img {
      max-width: 30px;
    }
  }

  &-logo {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    margin-bottom: 50px;

    p {
      font-size: 20px;
      font-weight: bold;
    }
  }

  &-collapse {
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 10px 20px;
      border-bottom: 1px solid $cl-bg-navbar-account;

      a {
        display: inline-block;
        width: 100%;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 15px;
      }

      &:hover {
        background-color: $cl-bg-navbar-account;
        cursor: pointer;
      }

      &:has(.router-link-exact-active) {
        background-color: $cl-bg-navbar-account;
      }
    }
  }
}
</style>
