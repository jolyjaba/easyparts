<template>
  <a-page-header :title="title" @back="() => $router.back()">
    <template slot="extra">
      <a-button type="primary" @click="writeAndCloseHandle">
        Записать и закрыть
      </a-button>
      <a-button @click="writeHandle">Записать</a-button>
    </template>
    <Form
      v-if="!$fetchState.pending"
      ref="form"
      v-model="selectOptions"
      :dynamic-form="dynamicForm"
      :is-group="isGroup"
      :rules="rules"
    />
    <TablePart
      ref="tabs"
      v-model="tablePartData"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
    />
  </a-page-header>
</template>

<script>
import editForm from '~/mixins/editForm'

export default {
  name: 'CustomersEditForm',
  mixins: [editForm],
  data: () => ({
    nameOfObject: 'Клиенты',
    typeOfObject: 'Справочники',
  }),
}
</script>
