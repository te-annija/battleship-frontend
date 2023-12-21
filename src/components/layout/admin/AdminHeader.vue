<!-- 
  FILENAME: AdminHeader.vue
  DESCRIPTION: The component renders top header on the admin page.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="admin__header-wrapper box-shadow">
    <div class="admin__header">
      <h1>{{ title }}</h1>
      <div v-if="user" class="admin__header-left">
        <theme-widget />
        <account-widget :user="user">
          <div>
            <router-link to="/">Client View</router-link>
          </div>
        </account-widget>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import AccountWidget from '@/components/widgets/AccountWidget.vue'
import ThemeWidget from '@/components/widgets/ThemeWidget.vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    }
  },
  components: {
    AccountWidget,
    ThemeWidget,
    RouterLink
  },
  computed: {
    ...mapState(useUserStore, ['user'])
  }
})
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/_variables';

.admin__header {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;

  &-wrapper {
    background-color: $cl-bg-admin;
    width: 100%;
    border-bottom: solid 1px $cl-primary;
  }

  &-expand {
    margin-right: 10px;
  }

  &-left {
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
