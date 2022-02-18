<template>
  <AResult
    :status="`${error.statusCode}`"
    :title="`${error.statusCode}`"
    :sub-title="error.message"
  >
    <template #extra>
      <AButton type="primary" @click="$router.back()"> Назад </AButton>
    </template>
  </AResult>
</template>

<script>
export default {
  name: 'ErrorLayout',
  props: { error: { type: Object, required: true } },
}
</script>
