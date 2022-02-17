<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButtonGroup>
        <AButton
          :loading="loading"
          type="primary"
          @click="writeAndCloseHandle"
        >
          Провести и закрыть
        </AButton>
        <AButton :loading="loading" @click="writeHandle"> Записать </AButton>
        <AButton :loading="loading" @click="postDocument"> Провести </AButton>
      </AButtonGroup>
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
  </APageHeader>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'MovementOfGoodsCreateForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'ПеремещениеТоваров',
    typeOfObject: 'Документы',
  }),
  watch: {
    warehouses: {
      handler(val) {
        this.dynamicForm = {
          keys: this.dynamicForm.keys.map((item) => {
            const key = item.key
            const obj = val.find((warehouse) => warehouse[key] !== undefined)
            const value = obj?.[key] || item.value
            if (val.some((obj) => obj[key] !== undefined)) {
              this.selectOptions = {
                ...this.selectOptions,
                Склады: [
                  ...this.selectOptions.Склады,
                  {
                    Ссылка: obj[key],
                    Представление: obj[key + 'Представление'],
                  },
                ],
              }
            }
            return { ...item, value }
          }),
        }
      },
    },
  },
  methods: {
    async postDocument() {
      await this.writeHandle()
    },
  },
}
</script>
