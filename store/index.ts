import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
  metadata: { Данные: null },
  appState: null,
})

export interface Payload {
  nameOfObject: string
  typeOfObject: string
  commitType?: string
  action: string
  guid?: string
  params?: {}
  obj?: {}
}

export interface PayloadParams {
  formObj?: { keys: [] }
  typeOfObject: string
  nameOfObject: string
  commitType?: string
  ЭтоГруппа?: boolean
  action: string
  guid?: string
  params?: {}
}

export const createFormData = ({
  typeOfObject,
  nameOfObject,
  commitType,
  ЭтоГруппа,
  formObj,
  params,
  action,
  guid,
}: PayloadParams) => {
  const formData = { ЭтоГруппа }
  formObj?.keys?.forEach(({ key, value }) => {
    formData[key] = value
  })
  const payload = {
    typeOfObject,
    nameOfObject,
    commitType,
    formData,
    params,
    action,
    guid,
  }
  return payload
}

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  appState: ({ appState }) => appState,
  metadata: ({ metadata }) => metadata.Данные,
}

export const mutations: MutationTree<RootState> = {
  SET_APP_STATE: (state, payload) => (state.appState = payload),
  SET_METADATA: (state, payload) => (state.metadata = payload),
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtClientInit({ dispatch }) {
    await dispatch('fetchMetadata')
  },

  async fetchMetadata({ commit }) {
    const data = await this.$axios.$post('/Метаданные')
    commit('SET_METADATA', data)
  },

  async fetchOrWriteObject({ commit }, payload: PayloadParams) {
    const { typeOfObject, nameOfObject, action, params, formData, commitType } =
      createFormData(payload)
    const url = `/${typeOfObject}/${nameOfObject}/${action}`
    const data = await this.$axios.$post(url, { ...params, ...formData })
    commitType && commit(commitType, data)
    return data
  },

  async getOrUpdateObject({ commit }, payload: PayloadParams) {
    const {
      typeOfObject,
      nameOfObject,
      action,
      guid,
      params,
      formData,
      commitType,
    } = createFormData(payload)
    const url = `/${typeOfObject}/${nameOfObject}/${guid}/${action}`
    const data = await this.$axios.$post(url, { ...params, ...formData })
    commitType && commit(commitType, data)
    return data
  },

  async fetchByAPI({ commit }, payload: Payload) {
    const { action, commitType, params } = payload
    const data = await this.$axios.$post(`/API/${action}`, params)
    commitType && commit(commitType, data)
    return data
  },
}
