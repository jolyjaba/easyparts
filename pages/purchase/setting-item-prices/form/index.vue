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
      :table-part-filters="tablePartFilters"
    />
  </a-page-header>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'SettingItemPricesCreateForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'УстановкаЦенНоменклатуры',
    typeOfObject: 'Документы',
  }),
  computed: {
    tablePartFilters() {
      const nomenclatureToVatRate = {
        key: 'Номенклатура',
        relateTo: 'СтавкаНДС',
        cols: [{ type: 'Цены', key: 'Цена' }],
        async: {
          action: 'ПолучитьЦенуНоменклатур',
          params: {
            requisites: [
              {
                key: 'ТипЦены',
                value: this.dynamicForm.keys.find(({ key }) => key === 'ТипЦен')
                  .value,
              },
              { key: 'Номенклатуры', value: '' },
            ],
          },
        },
      }
      return [nomenclatureToVatRate]
    },
  },
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
