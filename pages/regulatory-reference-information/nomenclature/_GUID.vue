<template>
  <a-page-header :title="title" @back="() => $router.back()">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="route in routes" :key="route.path">
        <a @click="onClick(route)">
          {{ route.breadcrumbName }}
        </a>
      </a-breadcrumb-item>
    </a-breadcrumb>
    <br />
    <template slot="extra">
      <a-button
        type="primary"
        :disabled="!editable"
        @click="$router.push(`${path}/form`)"
      >
        Создать
      </a-button>
    </template>
    <DataTable
      :path="path"
      :editable="editable"
      :name-of-object="nameOfObject"
      :type-of-object="typeOfObject"
    />
  </a-page-header>
</template>

<script>
import titleAndEditable from '~/mixins/titleAndEditable'

export default {
  name: 'NomenclatureChild',
  mixins: [titleAndEditable],
  data: () => ({
    nameOfObject: 'Номенклатура',
    typeOfObject: 'Справочники',
  }),
  computed: {
    path() {
      return `/${this.$route.path.split('/').splice(-3, 2).join('/')}`
    },
  },
}
</script>
