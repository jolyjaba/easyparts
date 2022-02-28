<template>
  <AConfigProvider :locale="ruRu">
    <ALayout :has-sider="true" class="custom-layout">
      <ALayoutSider
        v-model="collapsed"
        collapsible
        :trigger="null"
        class="custom-sider"
        :theme="$colorMode.value"
      >
        <LazyNavigationTree />
      </ALayoutSider>
      <ALayout>
        <ALayoutHeader class="custom-layout-header">
          <ARow type="flex" justify="space-between">
            <ACol>
              <AIcon
                class="trigger"
                :type="`menu-${collapsed ? 'un' : ''}fold`"
                @click="() => (collapsed = !collapsed)"
              />
            </ACol>
            <ACol>
              <AButton class="logout-btn" icon="logout" @click="logout">
                Выйти
              </AButton>
            </ACol>
          </ARow>
        </ALayoutHeader>
        <Nuxt />
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
    collapsed: false,
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
    ...mapGetters({ appState: 'appState' }),
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
  methods: {
    logout() {
      localStorage.removeItem('user')
      this.$router.replace({ path: '/login' })
    },
  },
}
</script>

<style>
.custom-sider {
  width: auto !important;
  max-width: 100% !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}

.custom-layout {
  min-height: 100vh;
}

.custom-layout-header {
  background: white;
  padding: 0;
}

.trigger {
  font-size: 18px;
  padding: 0 24px;
}

.logout-btn {
  margin: 0 24px;
}
</style>
