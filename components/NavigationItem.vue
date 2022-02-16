<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <a-icon v-if="props.menuInfo.icon" :type="props.menuInfo.icon" />
      <span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children.length" :key="item.key">
        <a-icon v-if="item.icon" :type="item.icon" />
        <span>{{ item.title }}</span>
      </a-menu-item>
      <NavigationItem v-else :key="item.key" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { NavItemInterface } from './NavigationTree.vue'

export default Vue.extend({
  props: {
    menuInfo: {
      type: Object,
      required: true,
    } as PropOptions<NavItemInterface>,
  },
})
</script>
