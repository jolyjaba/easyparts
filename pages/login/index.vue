<template>
  <ARow justify="center" align="middle" type="flex">
    <ACol flex="0.5">
      <AFormModel
        layout="horizontal"
        :model="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
        @submit.native.prevent
      >
        <AFormModelItem label="Пользователь">
          <AInput
            v-model="form.user"
            placeholder="Введите название пользователя"
          >
            <AIcon slot="prefix" type="user" class="custom-icon" />
          </AInput>
        </AFormModelItem>
        <AFormModelItem label="Пароль">
          <AInput
            v-model="form.password"
            type="password"
            placeholder="Введите пароль"
          >
            <AIcon slot="prefix" type="lock" class="custom-icon" />
          </AInput>
        </AFormModelItem>
        <AFormModelItem :wrapper-col="{ span: 12, offset: 6 }">
          <AButton
            type="primary"
            html-type="submit"
            :disabled="form.user === '' || form.password === ''"
          >
            Войти
          </AButton>
        </AFormModelItem>
      </AFormModel>
    </ACol>
  </ARow>
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
  head() {
    const { title } = this
    return { title }
  },
  computed: {
    title() {
      return 'Авторизация'
    },
  },
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
