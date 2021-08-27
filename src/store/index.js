import Vue from 'vue'
import Vuex from 'vuex'

import { format } from 'date-fns'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [],
    loading: false,
    updating: false,
    snackbar: {
      show: false,
      text: ''
    },
    searchModel: false,
    groups: []
  },
  getters: {
    groupItems(state) {
      return state.groups.map(e => {
        return {
          text: e.name,
          value: e._id
        }
      })
    }
  },
  mutations: {
    // Groups
    FETCH_GROUPS(state, groups) {
      state.groups = groups
    },
    ADD_GROUP(state, group) {
      state.groups.unshift(group)
    },
    DELETE_GROUP(state, _id) {
      const index = state.groups.findIndex(group => group._id === _id)
      state.groups.splice(index, 1)
    },
    UPDATE_GROUP(state, { _id, updates }) {
      const group = state.groups.find(group => group._id === _id)
      Object.assign(group, updates)
    },
    SWITCH_SEARCH_MODEL(state) {
      state.searchModel = !state.searchModel
    },
    UPDATE_LOADING(state, loading) {
      state.loading = loading
    },
    UPDATE_UPDATING(state, updating) {
      state.updating = updating
    },
    // Tasks
    FETCH_TASKS(state, tasks) {
      state.tasks = tasks
    },
    ADD_TASK(state, task) {
      state.tasks.unshift(task)
    },
    DELETE_TASK(state, _id) {
      const index = state.tasks.findIndex(task => task._id === _id)
      state.tasks.splice(index, 1)
    },
    UPDATE_TASK(state, { _id, updates }) {
      const task = state.tasks.find(task => task._id === _id)
      Object.assign(task, updates)
    },
    SHOW_SNACKBAR(state, text) {
      state.snackbar.show = true
      state.snackbar.text = text
    }
  },
  actions: {
    // Groups
    async fetchGroups({ commit }) {
      commit('UPDATE_LOADING', true)
      const { data: groups } = await Vue.prototype.$http.get('/group')
      commit('FETCH_GROUPS', groups.reverse())
      commit('UPDATE_LOADING', false)
    },

    async addGroup({ commit }, group) {
      try {
        commit('UPDATE_UPDATING', true)
        const { data: _group } = await Vue.prototype.$http.post('/group', group)
        commit('ADD_GROUP', _group)
        commit('UPDATE_UPDATING', false)
        commit('SHOW_SNACKBAR', 'Group Added!')
      } catch (err) {
        commit('UPDATE_UPDATING', false)
        console.log('add task failed')
      }
    },

    async deleteGroup({ commit }, _id) {
      try {
        commit('UPDATE_UPDATING', true)
        await Vue.prototype.$http.delete(`/group/${_id}`)
        commit('DELETE_GROUP', _id)
        commit('UPDATE_UPDATING', false)
        commit('SHOW_SNACKBAR', 'Group Deleted!')
      } catch (err) {
        commit('UPDATE_UPDATING', false)
        console.log('err while delete the task', err)
      }
    },

    async updateGroup({ commit }, { _id, updates }) {
      try {
        commit('UPDATE_UPDATING', true)
        await Vue.prototype.$http.patch(`/group/${_id}`, updates)
        commit('UPDATE_GROUP', { _id, updates })
        commit('UPDATE_UPDATING', false)
        commit('SHOW_SNACKBAR', 'Group Updated!')
      } catch (err) {
        commit('UPDATE_UPDATING', false)
        console.log('updateTask error: ', err)
      }
    },

    // Tasks
    async fetchTasks({ commit }) {
      commit('UPDATE_LOADING', true)
      let { data: tasks } = await Vue.prototype.$http.get('/todo')
      tasks = tasks.map(e => {
        if (Object.prototype.hasOwnProperty.call(e, 'updatedAt')) {
          e.updatedAt = format(new Date(e.updatedAt), 'yyyy-MM-dd HH:mm:ss')
        }
        return e
      })
      commit('FETCH_TASKS', tasks.reverse())
      commit('UPDATE_LOADING', false)
    },

    async addTask({ commit }, task) {
      try {
        commit('UPDATE_UPDATING', true)
        const { data: _task } = await Vue.prototype.$http.post('/todo', task)
        commit('ADD_TASK', _task)
        commit('UPDATE_UPDATING', false)
        commit('SHOW_SNACKBAR', 'Task Added!')
      } catch (err) {
        commit('UPDATE_UPDATING', false)
        console.log('add task failed')
      }
    },

    async deleteTask({ commit }, _id) {
      try {
        commit('UPDATE_UPDATING', true)
        await Vue.prototype.$http.delete(`/todo/${_id}`)
        commit('DELETE_TASK', _id)
        commit('UPDATE_UPDATING', false)
        commit('SHOW_SNACKBAR', 'Task Deleted!')
      } catch (err) {
        commit('UPDATE_UPDATING', false)
        console.log('err while delete the task', err)
      }
    },

    // update the task, including done / undone / edit name
    async updateTask({ commit }, { _id, updates }) {
      try {
        commit('UPDATE_UPDATING', true)
        await Vue.prototype.$http.patch(`/todo/${_id}`, updates)
        commit('UPDATE_TASK', { _id, updates })
        commit('UPDATE_UPDATING', false)
        commit('SHOW_SNACKBAR', 'Task Updated!')
      } catch (err) {
        commit('UPDATE_UPDATING', false)
        console.log('updateTask error: ', err)
      }
    }
  },
  modules: {
  }
})
