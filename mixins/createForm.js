import { mapGetters } from 'vuex'

export default {
  data: () => ({
    warehouses: [],
    selectOptions: {},
    tablePartData: {},
    dynamicForm: { keys: [] },
  }),
  fetch() {
    const { rules } = this
    this.dynamicForm = {
      keys: Object.entries(rules)
        .map(([key, _value]) => {
          const type = _value.Тип[0]
          const value = type === 'Булево' ? false : type === 'Число' ? 0 : ''
          return { key, value }
        })
        .filter(({ key }) => rules[key].Видимость)
        .sort((a, b) => rules[a.key].Порядок - rules[b.key].Порядок),
    }
    Object.entries(rules).forEach(([key, value]) => {
      const Ссылка = value.СтандартноеЗначение
      const Представление = value.СтандартноеЗначениеПредставление
      if (Ссылка && Представление) {
        const [, obj] = value.Тип[0].split('.')
        this.selectOptions = {
          ...this.selectOptions,
          [obj]: [{ Ссылка, Представление }],
        }
        this.dynamicForm = {
          ...this.dynamicForm,
          keys: this.dynamicForm.keys.map((item) => ({
            ...item,
            value: item.key === key ? Ссылка : item.value,
          })),
        }
      }
    })
  },
  async mounted() {
    const { $store } = this
    const {
      Данные: { Ссылка: guid },
    } = await $store.dispatch('fetchByAPI', {
      action: 'ПолучитьИдентификаторТекущегоПользователя',
    })
    const {
      Данные: {
        ТабличныеЧасти: { Склады },
      },
    } = await $store.dispatch('getOrUpdateObject', {
      nameOfObject: 'Пользователи',
      typeOfObject: 'Справочники',
      action: 'Получить',
      guid,
    })
    this.warehouses = Склады
  },
  head() {
    const { title } = this
    return { title }
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    loading() {
      return this.$fetchState.pending
    },
    params() {
      return [{ key: 'Склад', values: this.warehouses }]
    },
    object() {
      const { metadata, typeOfObject, nameOfObject } = this
      return metadata[typeOfObject][nameOfObject]
    },
    rules() {
      return this.object.Реквизиты
    },
    tablePart() {
      return this.object.ТабличныеЧасти
    },
    title() {
      return this.object.Настройки.ПредставлениеОбъекта
    },
    isGroup() {
      return this.rules?.ЭтоГруппа?.СтандартноеЗначение !== undefined
    },
  },
  methods: {
    async postAndCloseHandle() {
      await this.writeHandle({ close: true, post: true })
    },
    async writeAndCloseHandle() {
      await this.writeHandle({ close: true })
    },
    async postDocument() {
      await this.writeHandle({ post: true })
    },
    async writeHandle({ close, post } = { close: false, post: false }) {
      const {
        tablePartData,
        typeOfObject,
        nameOfObject,
        dynamicForm,
        $router,
        $store,
        $route,
        $refs,
      } = this
      let tabsValid = true
      const tabsIsValid = $refs.tabs.validate()
      if (tabsIsValid !== undefined) {
        tabsValid = tabsIsValid
      }
      const valid = await $refs.form.validate()
      if (valid && tabsValid) {
        const formObj = {
          keys: dynamicForm.keys.map(({ key, value }) => ({
            key,
            value: key === 'Родитель' ? value || 'GUID-0' : value,
          })),
        }
        Object.entries(tablePartData).forEach(([key, value]) => {
          formObj.keys.push({
            key,
            value: value.map((item) => {
              let newItem = {}
              Object.keys(item).forEach((key) => {
                if (key !== 'key') {
                  const formValue = item[key].dynamicForm.value
                  newItem = {
                    ...newItem,
                    [key]:
                      typeof formValue === 'object' ? formValue.key : formValue,
                  }
                }
              })
              return newItem
            }),
          })
        })
        const payload = {
          action: 'Создать',
          typeOfObject,
          nameOfObject,
          formObj,
        }
        const { Данные } = await $store.dispatch('fetchOrWriteObject', payload)
        const guid = Данные?.Ссылка
        if (guid) {
          $router.replace({
            path: `${$route.path}/${guid}`,
            query: { post, close },
          })
        }
      }
    },
  },
}
