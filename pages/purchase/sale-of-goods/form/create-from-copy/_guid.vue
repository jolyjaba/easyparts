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
        <a-button :loading="loading" :disabled="posted" @click="postDocument">
          {{ posted ? 'Проведен' : 'Провести' }}
        </a-button>
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
      :synchronize-cols="synchronizeCols"
      multiselect-col="Номенклатура"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
      :table-part-filters="tablePartFilters"
    />
  </a-page-header>
</template>

<script>
import createCopyForm from '~/mixins/createCopyForm'

export default {
  name: 'SaleOfGoodsEditForm',
  mixins: [createCopyForm],
  data: () => ({
    nameOfObject: 'РеализацияТоваров',
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
                  ?.value,
              },
              { key: 'Номенклатуры', value: '' },
            ],
          },
        },
      }
      return [nomenclatureToVatRate]
    },
    filters() {
      const filter = this.dynamicForm.keys.find(
        ({ key }) => key === 'Контрагент'
      )
      return [{ ...filter, relation: 'Договор' }]
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
  },
  methods: {
    onChangeRelation(filter) {
      this.dynamicForm.keys = this.dynamicForm.keys.map(({ key, value }) => ({
        key,
        value: key === filter.relation ? '' : value,
      }))
    },
    async postDocument() {
      if (!this.posted) {
        await this.writeHandle()
      }
    },
  },
}
</script>
