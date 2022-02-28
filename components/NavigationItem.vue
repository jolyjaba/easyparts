<template functional>
  <ASubMenu :key="props.menuInfo.key" popup-class-name="custom-sub-menu">
    <span slot="title">
      <AIcon v-if="props.menuInfo.icon" :type="props.menuInfo.icon" />
      <span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <AMenuItem v-if="!item.children.length" :key="item.key">
        <AIcon v-if="item.icon" :type="item.icon" />
        <span>{{ item.title }}</span>
      </AMenuItem>
      <LazyNavigationItem v-else :key="item.key" :menu-info="item" />
    </template>
  </ASubMenu>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    menuInfo: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style>
.custom-sub-menu {
  overflow: scroll;
  max-height: 100vh;
}
</style>
