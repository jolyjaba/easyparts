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
    <LazyForm
      ref="form"
      v-model="selectOptions"
      :rules="rules"
      :params="params"
      :filters="filters"
      :dynamic-form="dynamicForm"
      @onChangeRelation="onChangeRelation"
    />
    <LazyTablePart
      ref="tabs"
      v-model="tablePartData"
      has-multiselect
      multiselect-col="Номенклатура"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
      :synchronize-cols="synchronizeCols"
      :table-part-filters="tablePartFilters"
    />
  </APageHeader>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'ReturnOfGoodsFromTheBuyerCreateForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'ВозвратТоваровОтПокупателя',
    typeOfObject: 'Документы',
  }),
  computed: {
    filters() {
      const counterParty = {
        ...this.dynamicForm.keys.find(({ key }) => key === 'Контрагент'),
        relation: 'Договор',
      }
      return [counterParty]
    },
    synchronizeCols() {
      const fields = {
        Сумма: (row) => ({
          dynamicForm: {
            value:
              row.Цена.dynamicForm.value * row.Количество.dynamicForm.value,
          },
        }),
        СуммаНДС: (row) => {
          const vatRate = +row.СтавкаНДС.dynamicForm.value.value.replace(
            '%',
            ''
          )
          return {
            dynamicForm: {
              value: +(
                (fields.Сумма(row).dynamicForm.value / (1 + vatRate / 100)) *
                (vatRate / 100)
              ).toFixed(2),
            },
          }
        },
      }
      return fields
    },
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
                value: this.dynamicForm.keys.find(({ key }) => key === 'Валюта')
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
    tablePartData: {
      handler(val) {
        let count = 0
        Object.keys(val).forEach((tab) => {
          val[tab]?.forEach((row) => {
            const sum = row?.Сумма
            if (sum !== undefined) {
              count += sum.dynamicForm.value
            }
          })
        })
        this.dynamicForm = {
          keys: this.dynamicForm.keys.map((item) => ({
            ...item,
            value: item.key === 'СуммаДокумента' ? count : item.value,
          })),
        }
      },
    },
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
    onChangeRelation(filter) {
      this.dynamicForm.keys = this.dynamicForm.keys.map(({ key, value }) => ({
        key,
        value: key.includes(filter.relation) ? '' : value,
      }))
    },
  },
}
</script>
