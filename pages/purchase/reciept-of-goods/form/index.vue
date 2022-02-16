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
      :filters="filters"
      :dynamic-form="dynamicForm"
      @onChangeRelation="onChangeRelation"
    />
    <TablePart
      ref="tabs"
      v-model="tablePartData"
      has-multiselect
      multiselect-col="Номенклатура"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
      :synchronize-cols="synchronizeCols"
      :table-part-filters="tablePartFilters"
    />
  </a-page-header>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'ReceiptOfGoodsCreateForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'ПоступлениеТоваров',
    typeOfObject: 'Документы',
  }),
  computed: {
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
    filters() {
      const counterParty = {
        ...this.dynamicForm.keys.find(({ key }) => key === 'Контрагент'),
        relation: 'Договор',
      }
      return [counterParty]
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
        value: key === filter.relation ? '' : value,
      }))
    },
    async postDocument() {
      await this.writeHandle()
    },
  },
}
</script>
