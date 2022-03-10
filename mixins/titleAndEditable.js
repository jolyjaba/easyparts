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
    if (this.hasPrintOption) {
      const { Данные } = await this.$store.dispatch('fetchByAPI', {
        action: 'ПолучитьСписокПечатныхФорм',
        params: {
          Назначение: this.fullKey,
        },
      })
      this.printObj = Данные
    }
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    path() {
      const {
        $route: { name },
      } = this
      return encodeURI(`/${name.replace('-GUID', '').split('-').join('/')}`)
    },
    isGroup() {
      return this.requisites?.ЭтоГруппа?.СтандартноеЗначение !== undefined
    },
    object() {
      const { metadata, typeOfObject, nameOfObject } = this
      return metadata[typeOfObject][nameOfObject]
    },
    requisites() {
      return this.object.Реквизиты
    },
    fullKey() {
      const { $route, metadata } = this
      const [parentCategory, nameOfObject] = $route.name.split('-')
      const found = metadata.Подсистемы[parentCategory].Состав.find(
        (item) => item.ИмяОбъекта.split('.')[1] === nameOfObject
      )
      return found?.ИмяОбъекта || ''
    },
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
