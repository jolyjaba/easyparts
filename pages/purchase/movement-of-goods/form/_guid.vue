<template>
  <a-page-header :title="title" @back="() => $router.back()">
    <template slot="extra">
      <a-button-group>
        <a-button
          :loading="loading"
          type="primary"
          @click="writeAndCloseHandle"
        >
          Провести и закрыть
        </a-button>
        <a-button :loading="loading" @click="writeHandle"> Записать </a-button>
        <a-button :loading="loading" :disabled="posted" @click="postDocument">
          {{ posted ? 'Проведен' : 'Провести' }}
        </a-button>
      </a-button-group>
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
  </a-page-header>
</template>

<script>
import editForm from '~/mixins/editForm'

export default {
  name: 'MovementOfGoodsEditForm',
  mixins: [editForm],
  data: () => ({
    nameOfObject: 'ПеремещениеТоваров',
    typeOfObject: 'Документы',
  }),
  methods: {
    async postDocument() {
      if (!this.posted) {
        const payload = {
          nameOfObject: this.nameOfObject,
          typeOfObject: this.typeOfObject,
          guid: this.selected.Ссылка,
          action: 'Провести',
        }
        await this.$store.dispatch('getOrUpdateObject', payload)
        this.$fetch()
      }
    },
  },
}
</script>
