<template>
  <a-row justify="center" align="middle" type="flex">
    <a-col flex="0.5">
      <a-form-model
        layout="horizontal"
        :model="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
        @submit.native.prevent
      >
        <a-form-model-item label="Пользователь">
          <a-input
            v-model="form.user"
            placeholder="Введите название пользователя"
          >
            <a-icon slot="prefix" type="user" class="custom-icon" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="Пароль">
          <a-input
            v-model="form.password"
            type="password"
            placeholder="Введите пароль"
          >
            <a-icon slot="prefix" type="lock" class="custom-icon" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-button
            type="primary"
            html-type="submit"
            :disabled="form.user === '' || form.password === ''"
          >
            Войти
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'login',
  data: () => ({
    form: {
      user: '',
      password: '',
    },
    formItemLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    },
  }),
  methods: {
    async handleSubmit() {
      localStorage.setItem('user', JSON.stringify(this.form))
      const { Ошибка } = await this.$store.dispatch('fetchMetadata')
      if (!Ошибка) {
        this.$router.replace({ path: '/' })
        return
      }
      localStorage.removeItem('user')
    },
  },
}
</script>

<style scoped>
.custom-icon {
  color: #00000040;
}
</style>
