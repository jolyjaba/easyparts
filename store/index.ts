import { GetterTree, ActionTree, MutationTree } from 'vuex'
import type { IPayload } from '~/types/payloadParams'
import createFormData from '~/utils/createFormData'

export const state = () => ({
  metadata: { Данные: null },
  appState: null,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  appState: ({ appState }) => appState,
  metadata: ({ metadata }) => metadata.Данные,
}

export const mutations: MutationTree<RootState> = {
  SET_METADATA: (state, payload) => (state.metadata = payload),
  SET_APP_STATE: (state, payload) => (state.appState = payload),
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtClientInit({ dispatch }) {
    const user = localStorage.getItem('user')
    if (user) {
      await dispatch('fetchMetadata')
    }
  },

  async fetchMetadata({ commit }) {
    const data = await this.$axios.$post('/Метаданные')
    commit('SET_METADATA', data)
    return data
  },

  async fetchOrWriteObject(_, payload: IPayload) {
    const { typeOfObject, nameOfObject, action, params, formData } =
      createFormData(payload)
    const url = `/${typeOfObject}/${nameOfObject}/${action}`
    const data = await this.$axios.$post(url, { ...params, ...formData })
    return data
  },

  async getOrUpdateObject(_, payload: IPayload) {
    const { typeOfObject, nameOfObject, action, guid, params, formData } =
      createFormData(payload)
    const url = `/${typeOfObject}/${nameOfObject}/${guid}/${action}`
    const data = await this.$axios.$post(url, { ...params, ...formData })
    return data
  },

  async fetchByAPI(_, payload: IPayload) {
    const { action, params } = payload
    const data = await this.$axios.$post(`/API/${action}`, params)
    return data
  },
}
