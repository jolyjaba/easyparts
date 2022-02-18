// import { defineNuxtConfig } from '@nuxt/bridge'

export default {
  ssr: false,
  // bridge: {
  //   nitro: false,
  //   typescript: false,
  // },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'easyparts',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['ant-design-vue/dist/antd.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/antd-ui', '@/plugins/axios'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  router: {
    mode: 'hash',
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://github.com/harlan-zw/nuxt-webpack-optimisations
    'nuxt-webpack-optimisations',
    // https://github.com/Developmint/nuxt-purgecss
    'nuxt-purgecss',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://github.com/potato4d/nuxt-client-init-module
    'nuxt-client-init-module',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://github.com/victorgarciaesgi/nuxt-typed-router/tree/nuxt2
    'nuxt-typed-router',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
