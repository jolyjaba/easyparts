// import { defineNuxtConfig } from '@nuxt/bridge'
import { ContextReplacementPlugin } from 'webpack'
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin'

export default {
  ssr: false,
  loading: {
    continuous: true,
    color: '#1890ff',
    height: '5px',
  },
  loadingIndicator: {
    name: 'three-bounce',
    color: '#1890ff',
    background: 'white',
  },
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
    middleware: ['auth'],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://github.com/harlan-zw/nuxt-webpack-optimisations
    'nuxt-webpack-optimisations',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  webpackOptimisations: {
    hardSourcePlugin: process.env.NODE_ENV === 'development',
    parallelPlugin: process.env.NODE_ENV === 'development',
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://github.com/potato4d/nuxt-client-init-module
    'nuxt-client-init-module',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://dev.auth.nuxtjs.org
    // '@nuxtjs/auth-next',
    // https://v2.color-mode.nuxtjs.org
    '@nuxtjs/color-mode',
    // https://github.com/nuxt-community/dayjs-module
    '@nuxtjs/dayjs',
  ],

  dayjs: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.module.rules.push({
        loader: 'webpack-ant-icon-loader',
        enforce: 'pre',
        // options: {
        //   chunkName: 'antd-icons',
        // },
        include: [require.resolve('@ant-design/icons/lib')],
      })
    },
    plugins: [
      new AntdDayjsWebpackPlugin({
        replaceMoment: true,
        plugins: [
          'isSameOrBefore',
          'isSameOrAfter',
          'advancedFormat',
          'customParseFormat',
          'weekday',
          'weekYear',
          'weekOfYear',
          'isMoment',
          'localeData',
          'localizedFormat',
          'badMutable',
        ],
      }),
      new ContextReplacementPlugin(/ant-design-vue[/\\]locale$/, /ru_RU/),
    ],
  },
}
