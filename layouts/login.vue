<template>
  <AConfigProvider :locale="ruRu">
    <ALayout>
      <Nuxt class="custom-nuxt-layout" />
    </ALayout>
  </AConfigProvider>
</template>

<script>
import ruRu from 'ant-design-vue/lib/locale/ru_RU'

export default {
  name: 'LoginLayout',
  data: () => ({
    ruRu,
  }),
}
</script>

<style scoped>
.custom-nuxt-layout {
  min-height: 100vh;
}
</style>
