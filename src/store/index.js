import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [],
    loading: false,
    snackbar: {
      show: false,
      text: ''
    }
  },
  mutations: {
    UPDATE_LOADING(state, loading) {
      state.loading = loading
    },
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
    async fetchTasks({ commit }) {
      commit('UPDATE_LOADING', true)
      const { data: tasks } = await Vue.prototype.$http.get('/todo')
      commit('FETCH_TASKS', tasks.reverse())
      commit('UPDATE_LOADING', false)
    },

    async addTask({ commit }, task) {
      try {
        const { data: _task } = await Vue.prototype.$http.post('/todo', task)
        commit('ADD_TASK', _task)
        commit('SHOW_SNACKBAR', 'Task Added!')
      } catch (err) {
        console.log('add task failed')
      }
    },

    async deleteTask({ commit }, _id) {
      try {
        await Vue.prototype.$http.delete(`/todo/${_id}`)
        commit('DELETE_TASK', _id)
        commit('SHOW_SNACKBAR', 'Task Deleted!')
      } catch (err) {
        console.log('err while delete the task', err)
      }
    },

    // update the task, including done / undone / edit name
    async updateTask({ commit }, { _id, updates }) {
      try {
        await Vue.prototype.$http.patch(`/todo/${_id}`, updates)
        commit('UPDATE_TASK', { _id, updates })
        commit('SHOW_SNACKBAR', 'Task Updated!')
      } catch (err) {
        console.log('updateTask error: ', err)
      }
    }
  },
  modules: {
  }
})
