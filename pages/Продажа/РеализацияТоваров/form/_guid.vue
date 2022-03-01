<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButtonGroup>
        <AButton :loading="loading" type="primary" @click="postAndCloseHandle">
          Провести и закрыть
        </AButton>
        <AButton :loading="loading" @click="writeHandle"> Записать </AButton>
        <AButton :loading="loading" :disabled="posted" @click="postDocument">
          {{ posted ? 'Проведен' : 'Провести' }}
        </AButton>
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
      :synchronize-cols="synchronizeCols"
      multiselect-col="Номенклатура"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
      :table-part-filters="tablePartFilters"
    />
  </APageHeader>
</template>

<script>
import editForm from '~/mixins/editForm'

export default {
  name: 'SaleOfGoodsEditForm',
  mixins: [editForm],
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
      const form = this.dynamicForm.keys.find(({ key }) => key === 'Контрагент')
      const filter1 = {
        ...form,
        relation: 'Договор',
        synonym: 'Договор контрагента',
      }
      return [filter1]
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
    onChangeRelation(filters) {
      filters.forEach((filter) => {
        this.dynamicForm.keys = this.dynamicForm.keys.map(({ key, value }) => ({
          key,
          value: key.includes(filter.relation) ? '' : value,
        }))
      })
    },
  },
}
</script>
