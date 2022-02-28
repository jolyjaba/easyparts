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
      <NuxtLink :to="`${$route.path}/form`">
        <AButton type="primary" :disabled="!editable"> Создать </AButton>
      </NuxtLink>
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
  name: 'ServiceCatalog',
  mixins: [titleAndEditable],
  data: () => ({
    nameOfObject: 'КаталогУслуг',
    typeOfObject: 'Справочники',
  }),
}
</script>
