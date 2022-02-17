<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton
        type="primary"
        :disabled="!editable"
        @click="$router.push(`${$route.path}/form`)"
      >
        Создать
      </AButton>
    </template>
    <DataTable
      :editable="editable"
      :name-of-object="nameOfObject"
      :type-of-object="typeOfObject"
    />
  </APageHeader>
</template>

<script>
import titleAndEditable from '~/mixins/titleAndEditable'

export default {
  name: 'CustomersPage',
  mixins: [titleAndEditable],
  data: () => ({
    nameOfObject: 'Клиенты',
    typeOfObject: 'Справочники',
  }),
}
</script>
