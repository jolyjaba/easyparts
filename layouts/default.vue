<template>
  <AConfigProvider :locale="ruRu">
    <ALayout :has-sider="true" class="custom-layout">
      <NavigationTree :collapsed="collapsed" />
      <ALayout>
        <ALayoutHeader class="custom-layout-header">
          <AIcon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </ALayoutHeader>
        <Nuxt class="custom-nuxt-layout" />
      </ALayout>
    </ALayout>
  </AConfigProvider>
</template>

<script>
import { mapGetters } from 'vuex'
import ruRu from 'ant-design-vue/lib/locale/ru_RU'

export default {
  name: 'DefaultLayout',
  provide() {
    const { routes, modalTableRoutes } = this
    return {
      routes,
      modalTableRoutes,
    }
  },
  data: () => ({
    ruRu,
    collapsed: true,
    modalTableRoutes: [
      {
        path: '00000000-0000-0000-0000-000000000000',
        breadcrumbName: 'Родитель',
      },
    ],
    routes: [
      {
        path: '',
        breadcrumbName: 'Родитель',
      },
    ],
  }),
  computed: {
    ...mapGetters(['appState']),
  },
  watch: {
    appState: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          const { state, message } = newVal
          if (state === 'error') {
            this.$notification.error({
              message: message.ТекстОшибки,
              description: message.Сообщения.join(',\n'),
            })
          } else if (state === 'created_success') {
            this.$message.success(message)
          }
        }
      },
    },
  },
}
</script>

<style scoped>
.custom-layout {
  min-height: 100vh;
}

.custom-layout-header {
  background: white;
  padding: 0;
}

.custom-nuxt-layout {
  min-height: 100vh;
}

.trigger {
  font-size: 18px;
  padding: 0 24px;
}
</style>
