<template>
  <AMenu
    mode="inline"
    class="custom-menu"
    :open-keys="openKeys"
    :selected-keys="selectedKeys"
    @openChange="onOpenChange"
    @click="onClick($event)"
  >
    <template v-for="navigation in routes">
      <AMenuItem v-if="!navigation.children.length" :key="navigation.key">
        <AIcon v-if="navigation.icon" :type="navigation.icon" />
        <span>{{ navigation.title }}</span>
      </AMenuItem>
      <LazyNavigationItem
        v-else
        :key="navigation.key"
        :menu-info="navigation"
      />
    </template>
  </AMenu>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import getParentPath from '~/utils/getParentPath'

export default Vue.extend({
  data: () => ({
    openKeys: [] as string[],
  }),
  computed: {
    ...mapGetters({ metadata: 'metadata' }),
    selectedKeys() {
      return [getParentPath(this.$route)]
    },
    routes() {
      const rotes = this.metadata.Подсистемы
      const obj = Object.keys(rotes).map((key) => ({
        key,
        icon: rotes[key].Настройки.Картинка,
        title: rotes[key].Настройки.Синоним,
        children: rotes[key].Состав.map(
          (item: { ИмяОбъекта: string; Синоним: string }) => ({
            key: item.ИмяОбъекта.split('.')[1],
            title: item.Синоним,
            children: [],
            icon: null,
          })
        ),
      }))
      return obj
    },
  },
  methods: {
    onOpenChange(keys: string[]) {
      if (keys.length) {
        this.openKeys = [keys[keys.length - 1]]
      } else {
        this.openKeys = []
      }
    },
    onClick($event: { keyPath: string[] }) {
      const path = `/${encodeURI($event.keyPath.reverse().join('/'))}`
      this.$router.push(path)
    },
  },
})
</script>

<style scoped>
.custom-menu {
  width: 100% !important;
}
</style>
