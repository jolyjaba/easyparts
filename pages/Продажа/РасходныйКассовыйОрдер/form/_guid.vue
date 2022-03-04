<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButtonGroup>
        <AButton :loading="loading" type="primary" @click="postAndCloseHandle">
          Провести и закрыть
        </AButton>
        <AButton :loading="loading" @click="writeHandle"> Записать </AButton>
        <AButton :loading="loading" :disabled="posted" @click="postDocument">
          {{ posted ? 'Проведен' : 'Провести' }}
        </AButton>
      </AButtonGroup>
    </template>
    <LazyForm
      ref="form"
      v-model="selectOptions"
      :rules="rules"
      :params="params"
      :dynamic-form="dynamicForm"
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
  name: 'AccountCashWarrantEditForm',
  mixins: [editForm],
  data: () => ({
    nameOfObject: 'РасходныйКассовыйОрдер',
    typeOfObject: 'Документы',
  }),
}
</script>
