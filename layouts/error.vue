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

<script>
import { Button, Result } from 'ant-design-vue'
export default {
  name: 'ErrorLayout',
  components: {
    AResult: Result,
    AButton: Button,
  },
  props: {
    error: { type: Object, required: true },
  },
}
</script>
