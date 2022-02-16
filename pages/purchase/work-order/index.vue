<template>
  <a-page-header :title="title" @back="() => $router.back()">
    <template slot="extra">
      <a-button
        type="primary"
        :disabled="!editable"
        @click="$router.push(`${$route.path}/form`)"
      >
        Создать
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
  name: 'WorkOrder',
  mixins: [titleAndEditable],
  data: () => ({
    nameOfObject: 'НарядНаРаботы',
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
