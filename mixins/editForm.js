import { mapGetters } from 'vuex'

export default {
  data: () => ({
    selected: null,
    warehouses: [],
    selectOptions: {},
    tablePartData: {},
    dynamicForm: { keys: [] },
  }),
  async fetch() {
    const {
      $store,
      typeOfObject,
      nameOfObject,
      setDynamicForm,
      $route: {
        params: { guid },
      },
      metadata,
    } = this
    const payload = {
      action: 'Получить',
      typeOfObject,
      nameOfObject,
      guid,
    }
    const { Данные } = await $store.dispatch(`getOrUpdateObject`, payload)
    this.selected = Данные
    const selectedTablePart = Данные.ТабличныеЧасти
    Object.entries(selectedTablePart).forEach(([key, value]) => {
      this.tablePartData = {
        ...this.tablePartData,
        [key]: value.map((item, index) => {
          let newItem = { key: index }
          Object.entries(item).forEach(([_key, _value]) => {
            const value = item[_key + 'Представление']
            const key = item[_key]
            if (value !== undefined && item[_key] !== undefined) {
              if (metadata.Перечисления[_key] !== undefined) {
                newItem = {
                  ...newItem,
                  [_key]: { dynamicForm: { value: key } },
                }
              } else {
                newItem = {
                  ...newItem,
                  [_key]: { dynamicForm: { value: { key, value } } },
                }
              }
            } else if (!_key.includes('Представление')) {
              newItem = {
                ...newItem,
                [_key]: { dynamicForm: { value: key } },
              }
            }
          })
          return newItem
        }),
      }
    })
    setDynamicForm()
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
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(val) {
        let post = val.query?.post
        let close = val.query?.close
        if (post) {
          post = JSON.parse(post)
          if (post) {
            this.postDocument()
          }
        }
        if (close) {
          close = JSON.parse(close)
          if (close) {
            this.$router.back()
          }
        }
      },
    },
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    posted() {
      return this.selected?.Проведен
    },
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
    async writeAndCloseHandle() {
      const succes = await this.writeHandle()
      if (succes) {
        this.$router.back()
      }
    },
    async postAndCloseHandle() {
      const { writeHandle, postDocument, $router } = this
      const succes = await writeHandle()
      if (succes) {
        const posted = await postDocument({ close: true })
        if (posted) {
          $router.back()
        }
      }
    },
    async postDocument({ close } = { close: false }) {
      if (!this.posted) {
        const {
          $store,
          $fetch,
          nameOfObject,
          typeOfObject,
          $route: {
            params: { guid },
          },
        } = this
        const payload = {
          action: 'Провести',
          nameOfObject,
          typeOfObject,
          guid,
        }
        const { Ошибка } = await $store.dispatch('getOrUpdateObject', payload)
        if (!Ошибка) {
          if (close) {
            return true
          }
          $fetch()
        }
        return false
      }
      return true
    },
    async writeHandle() {
      const {
        $refs,
        $store,
        dynamicForm,
        typeOfObject,
        nameOfObject,
        tablePartData,
        $route: {
          params: { guid },
        },
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
          guid,
          formObj,
          nameOfObject,
          typeOfObject,
          action: 'Записать',
        }
        const { Ошибка } = await $store.dispatch(`getOrUpdateObject`, payload)
        if (!Ошибка) {
          return true
        }
        return false
      }
    },
    setDynamicForm() {
      const { setFormData, setSelectOptions, selected } = this
      setSelectOptions(selected)
      setFormData(selected)
    },
    setSelectOptions(data) {
      const { rules } = this
      Object.keys(data).forEach((key) => {
        const suffix = 'Представление'
        const objValue = key + suffix
        if (!key.includes(suffix) && !!data[objValue] && !!rules[key]) {
          const [type, obj] = rules[key].Тип[0].split('.')
          if (type === 'Справочник' || type === 'Документ') {
            this.selectOptions = {
              ...this.selectOptions,
              [obj]: [{ Ссылка: data[key], Представление: data[objValue] }],
            }
          }
        }
      })
    },
    setFormData(data) {
      const { rules } = this
      this.dynamicForm = {
        keys: Object.entries(data)
          .map(([key, value]) => ({ key, value }))
          .filter(({ key }) => rules[key]?.Видимость)
          .sort((a, b) => rules[a.key].Порядок - rules[b.key].Порядок),
      }
    },
  },
}
