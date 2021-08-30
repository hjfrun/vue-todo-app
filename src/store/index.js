import Vue from 'vue'
import Vuex from 'vuex'

import task from './task'
import group from './group'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    updating: false,
    snackbar: {
      show: false,
      text: ''
    },
    searchModel: false,
  },
  getters: {},
  mutations: {
    SWITCH_SEARCH_MODEL(state) {
      state.searchModel = !state.searchModel
    },
    UPDATE_LOADING(state, loading) {
      state.loading = loading
    },
    UPDATE_UPDATING(state, updating) {
      state.updating = updating
    },
    SHOW_SNACKBAR(state, text) {
      state.snackbar.show = true
      state.snackbar.text = text
    }
  },
  actions: {},
  modules: {
    task,
    group
  }
})
