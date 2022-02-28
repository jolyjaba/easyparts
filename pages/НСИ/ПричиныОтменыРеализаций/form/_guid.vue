<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton type="primary" @click="writeAndCloseHandle">
        Записать и закрыть
      </AButton>
      <AButton @click="writeHandle">Записать</AButton>
    </template>
    <LazyForm
      v-if="!$fetchState.pending"
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
import editForm from '~/mixins/editForm'

export default {
  name: 'ReasonsForCancelingImplementationsEditForm',
  mixins: [editForm],
  data: () => ({
    nameOfObject: 'ПричиныОтменыРеализаций',
    typeOfObject: 'Справочники',
  }),
}
</script>
