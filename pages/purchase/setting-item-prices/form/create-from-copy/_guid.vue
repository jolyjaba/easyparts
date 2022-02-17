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
import createCopyForm from '~/mixins/createCopyForm'

export default {
  name: 'SettingItemPricesEditForm',
  mixins: [createCopyForm],
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
}
</script>
