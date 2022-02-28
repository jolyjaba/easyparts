<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton type="primary" @click="writeAndCloseHandle">
        Записать и закрыть
      </AButton>
      <AButton @click="writeHandle">Записать</AButton>
    </template>
    <LazyForm
      ref="form"
      v-model="selectOptions"
      :dynamic-form="dynamicForm"
      :is-group="isGroup"
      :rules="rules"
    />
    <LazyTablePart
      ref="tabs"
      v-model="tablePartData"
      :type-of-object="typeOfObject"
      :name-of-object="nameOfObject"
    />
  </APageHeader>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'ContractingPartiesForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'Контрагенты',
    typeOfObject: 'Справочники',
  }),
}
</script>
