import Vue from 'vue'
import Vuex from 'vuex'

import task from './task'
import group from './group'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    }
  },
  actions: {},
  modules: {
    task,
    group
  }
})
