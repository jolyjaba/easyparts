import { mapGetters } from 'vuex'

export default {
  inject: {
    routes: 'routes',
  },
  head() {
    const { title } = this
    return { title }
  },
  async fetch() {
    const {
      $route,
      $nuxt: {
        context: { from },
      },
      $store,
      routes,
      nameOfObject,
      typeOfObject,
    } = this
    const guid = $route.params.GUID
    if (guid) {
      const index = routes.findIndex((item) => item.path === guid)
      if (index !== -1) {
        if (from.params.GUID) {
          routes.splice(index + 1)
        }
      } else {
        const {
          Данные: { Наименование: breadcrumbName },
        } = await $store.dispatch('getOrUpdateObject', {
          action: 'Получить',
          nameOfObject,
          typeOfObject,
          guid,
        })
        routes.push({ path: $route.params.GUID, breadcrumbName })
      }
    } else {
      routes.splice(1)
    }
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    editable() {
      const { metadata, typeOfObject, nameOfObject } = this
      return metadata[typeOfObject][nameOfObject].Настройки
        .ВозможностьРедактировать
    },
    title() {
      const { metadata, typeOfObject, nameOfObject } = this
      return metadata[typeOfObject][nameOfObject].Настройки.ПредставлениеСписка
    },
  },
  methods: {
    copyHandler(record) {
      const { $router, $route } = this
      $router.push(`${$route.path}/form/create-from-copy/${record.Ссылка}`)
    },
    onClick(route) {
      const { $route, $router, routes } = this
      const guid = $route.params.GUID
      if (route.path) {
        if (guid !== route.path) {
          const index = routes.findIndex((item) => item.path === route.path)
          if (index) {
            const countOfBack = routes.length - index - 1
            $router.go(-countOfBack)
          }
        }
      } else if (guid) {
        const countOfBack = routes.length - 1
        $router.go(-countOfBack)
      }
    },
  },
}
