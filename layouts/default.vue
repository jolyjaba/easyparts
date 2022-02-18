<template>
  <AConfigProvider :locale="ruRu">
    <ALayout :has-sider="true" style="min-height: 100vh">
      <NavigationTree :width="width" />
      <ALayoutContent>
        <Nuxt class="full-height" />
      </ALayoutContent>
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
    width: '300px',
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
  methods: {},
}
</script>

<style>
.full-height {
  min-height: 100%;
}
</style>
