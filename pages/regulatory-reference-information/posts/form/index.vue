<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton type="primary" @click="writeAndCloseHandle">
        Записать и закрыть
      </AButton>
      <AButton @click="writeHandle">Записать</AButton>
    </template>
    <Form
      ref="form"
      v-model="selectOptions"
      :dynamic-form="dynamicForm"
      :is-group="isGroup"
      :params="params"
      :rules="rules"
    />
    <TablePart
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
  name: 'PostsForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'Посты',
    typeOfObject: 'Справочники',
  }),
}
</script>
