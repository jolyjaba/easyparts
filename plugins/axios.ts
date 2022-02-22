import { Plugin } from '@nuxt/types'
import { encode } from 'base-64'

function unicodeUnEscape(string: string) {
  return string.replace(/%u([\dA-Z]{4})|%([\dA-Z]{2})/g, function (_, m1, m2) {
    return String.fromCharCode(parseInt('0x' + (m1 || m2)))
  })
}

const axios: Plugin = ({ $axios, store }) => {
  $axios.onRequest((req) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.user && user.password) {
      const auth = `${user.user}:${user.password}`
      const USRPWD = `${encode(unicodeUnEscape(encodeURIComponent(auth)))}`
      req.headers = {
        USRPWD,
        DEBUG: true,
      }
    }
  })
  $axios.onResponse((res) => {
    if (res.data.Ошибка) {
      store.commit('SET_APP_STATE', { state: 'error', message: res.data })
    } else {
      const { Ссылка, ...prevKeys } = res.data.Данные
      if (Ссылка && JSON.stringify(prevKeys) === '{}') {
        store.commit('SET_APP_STATE', {
          state: 'created_success',
          message: 'Объект успешно создан! 🥳',
        })
        return
      }
      store.commit('SET_APP_STATE', { state: 'success', message: res.data })
    }
  })
}

export default axios
