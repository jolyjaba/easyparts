<template functional>
  <ASubMenu :key="props.menuInfo.key">
    <span slot="title">
      <AIcon v-if="props.menuInfo.icon" :type="props.menuInfo.icon" />
      <span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <AMenuItem v-if="!item.children.length" :key="item.key">
        <AIcon v-if="item.icon" :type="item.icon" />
        <span>{{ item.title }}</span>
      </AMenuItem>
      <NavigationItem v-else :key="item.key" :menu-info="item" />
    </template>
  </ASubMenu>
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
