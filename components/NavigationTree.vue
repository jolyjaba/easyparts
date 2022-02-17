<template>
  <ALayoutSider v-model="collapsed" collapsible width="300">
    <AMenu
      v-model="selectedKeys"
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
const navigationItems = require('@/assets/navigationRoutes.json')

export interface NavItemInterface {
  id: string
  icon: string
  title: string
  children: this[]
}

const getParentPath = (route: { path: string }) =>
  `/${route.path.split('/').splice(1, 2).join('/')}`

export default Vue.extend({
  data() {
    return {
      collapsed: false,
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
