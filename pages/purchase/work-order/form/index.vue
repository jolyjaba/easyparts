<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButtonGroup>
        <AButton :loading="loading" type="primary" @click="postAndCloseHandle">
          Провести и закрыть
        </AButton>
        <AButton :loading="loading" @click="writeHandle"> Записать </AButton>
        <AButton :loading="loading" @click="postDocument"> Провести </AButton>
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
    />
  </APageHeader>
</template>

<script>
import createForm from '~/mixins/createForm'

export default {
  name: 'WorkOrderCreateForm',
  mixins: [createForm],
  data: () => ({
    nameOfObject: 'НарядНаРаботы',
    typeOfObject: 'Документы',
  }),
}
</script>
