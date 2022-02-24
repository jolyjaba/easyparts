<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <NuxtLink :to="`${$route.fullPath}/form`">
        <AButton type="primary" :disabled="!editable"> Создать </AButton>
      </NuxtLink>
    </template>
    <DataTable
      :editable="editable"
      :name-of-object="nameOfObject"
      :type-of-object="typeOfObject"
    >
      <template slot="actions" slot-scope="{ record }">
        <AMenuItem v-if="hasCopyButton" key="copy">
          <NuxtLink
            tag="span"
            :to="`${$route.path}/form/create-from-copy/${record.Ссылка}`"
          >
            <AIcon type="copy" />
            Создать копию
          </NuxtLink>
        </AMenuItem>
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
    nameOfObject: {
      type: String,
      default() {
        return this.$route.name.split('-')[1]
      },
    },
    typeOfObject: { type: String, reqired: true, default: () => '' },
  },
}
</script>
