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
    >
      <template slot="actions" slot-scope="{ record }">
        <AButton
          v-if="hasCopyButton"
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
  name: 'MainTableLayout',
  mixins: [titleAndEditable],
  props: {
    hasCopyButton: { type: Boolean },
    nameOfObject: { type: String, reqired: true, default: () => '' },
    typeOfObject: { type: String, reqired: true, default: () => '' },
  },
}
</script>
