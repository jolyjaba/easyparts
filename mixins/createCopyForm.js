import editForm from '~/mixins/editForm'

export default {
  mixins: [editForm],
  computed: {
    posted() {
      return false
    },
  },
  methods: {
    async writeHandle({ close } = { close: false }) {
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
          if (!close) {
            const currentPath = `/${$route.path
              .split('/')
              .splice(-5, 3)
              .join('/')}`
            $router.replace(`${currentPath}/${guid}`)
            return
          }
          return true
        }
        return false
      }
    },
    setFormData(data) {
      data = { ...data, Номер: '' }
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
