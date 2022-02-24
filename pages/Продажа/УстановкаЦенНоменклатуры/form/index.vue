<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButtonGroup>
        <AButton :loading="loading" type="primary" @click="postAndCloseHandle">
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
      :table-part-filters="tablePartFilters"
    />
  </APageHeader>
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
                  ?.value,
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
}
</script>
