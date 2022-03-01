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
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
      :table-part-filters="tablePartFilters"
    />
  </APageHeader>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'PaymentOrderIncomingCreateForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'ПлатежноеПоручениеВходящее',
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
    filters() {
      const form = this.dynamicForm.keys.find(({ key }) => key === 'Контрагент')
      const filter1 = {
        ...form,
        relation: 'Договор',
        synonym: 'Договор контрагента',
      }
      const filter2 = {
        ...form,
        relation: 'БанковскийСчетОрганизации',
        synonym: 'Банковский счет организации',
      }
      const filter3 = {
        ...form,
        relation: 'БанковскийСчетКонтрагента',
        synonym: 'Банковский счет контрагента',
      }
      return [filter1, filter2, filter3]
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
