<template>
  <a-page-header :title="title" @back="() => $router.back()">
    <template slot="extra">
      <a-button type="primary" :disabled="!editable">
        <NuxtLink :to="`${$route.path}/form`"> Создать </NuxtLink>
      </a-button>
    </template>
    <DataTable
      :editable="editable"
      :name-of-object="nameOfObject"
      :type-of-object="typeOfObject"
    >
      <template slot="actions" slot-scope="{ record }">
        <a-button
          title="Создать новую копию"
          type="primary"
          icon="copy"
          @click="copyHandler(record)"
        />
      </template>
    </DataTable>
  </a-page-header>
</template>

<script>
import titleAndEditable from '~/mixins/titleAndEditable'

export default {
  name: 'ReceiptOfGoods',
  mixins: [titleAndEditable],
  data: () => ({
    nameOfObject: 'ПоступлениеТоваров',
    typeOfObject: 'Документы',
  }),
  methods: {
    copyHandler(record) {
      const { $router, $route } = this
      $router.push(`${$route.path}/form/create-from-copy/${record.Ссылка}`)
    },
  },
}
</script>
