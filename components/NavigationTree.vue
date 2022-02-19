<template>
  <ALayoutSider
    :collapsed="collapsed"
    class="custom-sider"
    :trigger="null"
    collapsible
  >
    <AMenu
      v-model="selectedKeys"
      class="custom-menu"
      theme="dark"
      mode="inline"
      @click="(event) => $router.push(event.key)"
    >
      <template v-for="navigation in navigationItems">
        <AMenuItem v-if="!navigation.children.length" :key="navigation.key">
          <AIcon v-if="navigation.icon" :type="navigation.icon" />
          <span>{{ navigation.title }}</span>
        </AMenuItem>
        <NavigationItem v-else :key="navigation.key" :menu-info="navigation" />
      </template>
    </AMenu>
  </ALayoutSider>
</template>

<script lang="ts">
import Vue from 'vue'
const navigationItems = require('~/assets/navigationRoutes.json')

export interface NavItemInterface {
  id: string
  icon: string
  title: string
  children: this[]
}

const getParentPath = (route: { path: string }) =>
  `/${route.path.split('/').splice(1, 2).join('/')}`

export default Vue.extend({
  props: {
    collapsed: { type: Boolean },
  },
  data() {
    return {
      selectedKeys: [getParentPath(this.$route)] as Array<string>,
      navigationItems: navigationItems as NavItemInterface[],
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        this.selectedKeys = [getParentPath(newVal)]
      },
    },
  },
})
</script>

<style scoped>
.custom-sider {
  width: auto !important;
  max-width: 100% !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
</style>
