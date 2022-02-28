<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <ABreadcrumb>
      <ABreadcrumbItem v-for="route in routes" :key="route.path">
        <a @click="onClick(route)">
          {{ route.breadcrumbName }}
        </a>
      </ABreadcrumbItem>
    </ABreadcrumb>
    <br />
    <template slot="extra">
      <AButton
        type="primary"
        :disabled="!editable"
        @click="$router.push(`${$route.path}/form`)"
      >
        Создать
      </AButton>
    </template>
    <LazyDataTable
      :editable="editable"
      :name-of-object="nameOfObject"
      :type-of-object="typeOfObject"
    />
  </APageHeader>
</template>

<script>
import titleAndEditable from '~/mixins/titleAndEditable'

export default {
  name: 'NomenclaturePage',
  mixins: [titleAndEditable],
  data: () => ({
    nameOfObject: 'Номенклатура',
    typeOfObject: 'Справочники',
  }),
}
</script>
