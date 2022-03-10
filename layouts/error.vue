<template>
  <AResult
    :status="`${error.statusCode}`"
    :title="`${error.statusCode}`"
    :sub-title="`${error.message}`"
  >
    <template #extra>
      <AButton type="primary" @click="$router.back()"> Назад </AButton>
    </template>
  </AResult>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import type { IError } from '~/types/error'

export default Vue.extend({
  name: 'ErrorLayout',
  props: {
    error: { type: Object, required: true } as PropOptions<IError>,
  },
})
</script>
