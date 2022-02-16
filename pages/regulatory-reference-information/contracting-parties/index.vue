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
    />
  </a-page-header>
</template>

<script>
import titleAndEditable from '~/mixins/titleAndEditable'

export default {
  name: 'ContractingParties',
  mixins: [titleAndEditable],
  data: () => ({
    nameOfObject: 'Контрагенты',
    typeOfObject: 'Справочники',
  }),
}
</script>
