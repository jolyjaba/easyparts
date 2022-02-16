<template>
  <a-page-header :title="title" @back="() => $router.back()">
    <template slot="extra">
      <a-button-group>
        <a-button
          :loading="loading"
          type="primary"
          @click="writeAndCloseHandle"
        >
          Провести и закрыть
        </a-button>
        <a-button :loading="loading" @click="writeHandle"> Записать </a-button>
        <a-button :loading="loading" @click="postDocument"> Провести </a-button>
      </a-button-group>
    </template>
    <Form
      ref="form"
      v-model="selectOptions"
      :rules="rules"
      :params="params"
      :dynamic-form="dynamicForm"
    />
    <TablePart
      ref="tabs"
      v-model="tablePartData"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
    />
  </a-page-header>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'WorkOrderCreateForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'НарядНаРаботы',
    typeOfObject: 'Документы',
  }),
  // watch: {
  //   warehouses: {
  //     handler(val) {
  //       this.dynamicForm = {
  //         keys: this.dynamicForm.keys.map((item) => {
  //           const key = item.key
  //           const obj = val.find((warehouse) => warehouse[key] !== undefined)
  //           const value = obj?.[key] || item.value
  //           if (val.some((obj) => obj[key] !== undefined)) {
  //             this.selectOptions = {
  //               ...this.selectOptions,
  //               Склады: [
  //                 ...this.selectOptions.Склады,
  //                 {
  //                   Ссылка: obj[key],
  //                   Представление: obj[key + 'Представление'],
  //                 },
  //               ],
  //             }
  //           }
  //           return { ...item, value }
  //         }),
  //       }
  //     },
  //   },
  // },
  methods: {
    async postDocument() {
      await this.writeHandle()
    },
  },
}
</script>
