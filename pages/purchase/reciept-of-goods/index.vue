<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton type="primary" :disabled="!editable">
        <NuxtLink :to="`${$route.path}/form`"> Создать </NuxtLink>
      </AButton>
    </template>
    <DataTable
      :editable="editable"
      :name-of-object="nameOfObject"
      :type-of-object="typeOfObject"
    >
      <template slot="actions" slot-scope="{ record }">
        <AButton
          title="Создать новую копию"
          type="primary"
          icon="copy"
          @click="copyHandler(record)"
        />
      </template>
    </DataTable>
  </APageHeader>
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
}
</script>
