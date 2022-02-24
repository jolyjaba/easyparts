<template>
  <ALayoutSider
    collapsible
    :trigger="null"
    class="custom-sider"
    :collapsed="collapsed"
  >
    <AMenu
      theme="dark"
      mode="inline"
      class="custom-menu"
      :selected-keys="selectedKeys"
      @click="onClick($event)"
    >
      <template v-for="navigation in routes">
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
import { mapGetters } from 'vuex'
import getParentPath from '~/utils/getParentPath'

export default Vue.extend({
  props: {
    collapsed: { type: Boolean },
  },
  computed: {
    ...mapGetters({ metadata: 'metadata' }),
    selectedKeys() {
      return [getParentPath(this.$route)]
    },
    routes() {
      const obj = Object.keys(this.metadata.Подсистемы).map((key) => ({
        key,
        title: this.metadata.Подсистемы[key].Настройки.Синоним,
        icon: this.metadata.Подсистемы[key].Настройки.Картинка,
        children: this.metadata.Подсистемы[key].Состав.map(
          (item: { ИмяОбъекта: string; Синоним: string }) => ({
            key: item.ИмяОбъекта.split('.')[1],
            title: item.Синоним,
            icon: null,
            children: [],
          })
        ),
      }))
      return obj
    },
  },
  methods: {
    onClick($event: any) {
      const fullPath = `/${encodeURI($event.keyPath.reverse().join('/'))}`
      if (fullPath !== this.$route.fullPath) {
        this.$router.push(fullPath)
      }
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

.custom-menu {
  width: auto !important;
}
</style>
