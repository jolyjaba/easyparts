<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton type="primary" @click="writeAndCloseHandle">
        Записать и закрыть
      </AButton>
      <AButton @click="writeHandle">Записать</AButton>
    </template>
    <Form
      v-if="!$fetchState.pending"
      ref="form"
      v-model="selectOptions"
      :dynamic-form="dynamicForm"
      :is-group="isGroup"
      :rules="rules"
    />
    <TablePart
      ref="tabs"
      v-model="tablePartData"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
    />
  </APageHeader>
</template>

<script>
import editForm from '~/mixins/editForm'

export default {
  name: 'CurrenciesEditForm',
  mixins: [editForm],
  data: () => ({
    nameOfObject: 'Валюты',
    typeOfObject: 'Справочники',
    newRules: {
      Один: {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 7,
        Синоним: 'Один',
        Тип: ['Строка'],
      },
      Два: {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 7,
        Синоним: 'Два',
        Тип: ['Строка'],
      },
      Пять: {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 8,
        Синоним: 'Пять',
        Тип: ['Строка'],
      },
      Род: {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 8,
        Синоним: 'Род',
        Тип: ['Строка'],
      },
      'Один дробной части': {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 9,
        Синоним: 'Один дробной части',
        Тип: ['Строка'],
      },
      'Два дробной части': {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 9,
        Синоним: 'Два дробной части',
        Тип: ['Строка'],
      },
      'Пять дробной части': {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 10,
        Синоним: 'Пять дробной части',
        Тип: ['Строка'],
      },
      'Род дробной части': {
        Видимость: true,
        Обязательный: false,
        Доступность: true,
        Порядок: 10,
        Синоним: 'Род дробной части',
        Тип: ['Строка'],
      },
    },
  }),
  async fetch() {
    const {
      $store,
      typeOfObject,
      nameOfObject,
      $route: {
        params: { guid },
      },
      setDynamicForm,
    } = this
    const payload = {
      action: 'Получить',
      typeOfObject,
      nameOfObject,
      guid,
    }
    const { Данные } = await $store.dispatch(`getOrUpdateObject`, payload)
    let currencyParams = {}
    const newRules = Object.entries(this.newRules)
    const values = Данные.ПараметрыПрописи.split(', ')
    newRules.forEach(([key], index) => {
      currencyParams = {
        ...currencyParams,
        [key]: values[index],
      }
    })
    this.selected = { ...Данные, ...currencyParams }
    setDynamicForm()
  },
  computed: {
    rules() {
      const { metadata, typeOfObject, nameOfObject, newRules } = this
      return { ...metadata[typeOfObject][nameOfObject].Реквизиты, ...newRules }
    },
  },
  methods: {
    async writeHandle() {
      const {
        $refs,
        $store,
        dynamicForm,
        typeOfObject,
        nameOfObject,
        newRules,
        $route: {
          params: { guid },
        },
      } = this
      const valid = await $refs.form.validate()
      if (valid) {
        const formObj = { keys: [] }
        let obj = { key: 'ПараметрыПрописи', value: [] }
        dynamicForm.keys.forEach(({ key, value }) => {
          if (newRules[key]) {
            obj.value.push(value)
          } else {
            formObj.keys.push({ key, value })
          }
        })
        obj = { ...obj, value: obj.value.join(', ') }
        formObj.keys.push(obj)
        const payload = {
          guid,
          formObj,
          nameOfObject,
          typeOfObject,
          action: 'Записать',
        }
        await $store.dispatch(`getOrUpdateObject`, payload)
      }
    },
  },
}
</script>
