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
import editForm from '~/mixins/editForm'

export default {
  name: 'SettingItemPricesEditForm',
  mixins: [editForm],
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
  methods: {
    async postDocument() {
      if (!this.posted) {
        const payload = {
          nameOfObject: this.nameOfObject,
          typeOfObject: this.typeOfObject,
          guid: this.selected.Ссылка,
          action: 'Провести',
        }
        await this.$store.dispatch('getOrUpdateObject', payload)
        this.$fetch()
      }
    },
  },
}
</script>
