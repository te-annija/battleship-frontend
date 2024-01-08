<!-- 
  FILENAME: AdminPage.vue
  DESCRIPTION: The component serves as the main container for admin page in the route '/admin'. Renders admin components.
  AUTHOR: Annija Karitone
-->
<template>
  <div class="admin">
    <admin-sidebar class="admin-sidebar" />
    <div class="admin-content">
      <admin-header :title="typeof $route.meta.title === 'string' ? $route.meta.title : ''" />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AdminSidebar from '@/components/layout/admin/AdminSidebar.vue'
import AdminHeader from '@/components/layout/admin/AdminHeader.vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  components: {
    AdminSidebar,
    AdminHeader,
    RouterView
  }
})
</script>

<style scoped lang="scss">
.admin {
  display: flex;
  height: 100vh;
  max-width: 100vw;

  &-content {
    padding-left: 60px;
    position: relative;
    width: 100%;
    min-width: 0;
  }
}
</style>
