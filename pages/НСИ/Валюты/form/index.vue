<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton type="primary" @click="writeAndCloseHandle">
        Записать и закрыть
      </AButton>
      <AButton @click="writeHandle">Записать</AButton>
    </template>
    <Form
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
import createForm from '~/mixins/createForm'

export default {
  name: 'CurrenciesCreateForm',
  mixins: [createForm],
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
  computed: {
    rules() {
      const { metadata, newRules, typeOfObject, nameOfObject } = this
      return {
        ...metadata[typeOfObject][nameOfObject].Реквизиты,
        ...newRules,
      }
    },
  },
  methods: {
    async writeHandle() {
      const {
        $refs,
        $store,
        typeOfObject,
        nameOfObject,
        dynamicForm,
        newRules,
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
          action: 'Создать',
          typeOfObject,
          nameOfObject,
          formObj,
        }
        await $store.dispatch('fetchOrWriteObject', payload)
      }
    },
  },
}
</script>
