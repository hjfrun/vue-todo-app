import Vue from 'vue'
import { format } from 'date-fns'

export default {
  namespaced: true,
  state: {
    tasks: []
  },
  mutations: {
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
    }
  },
  actions: {
    // Tasks
    async fetchTasks({ commit }) {
      let { data: tasks } = await Vue.prototype.$http.get('/todo')
      tasks = tasks.map(e => {
        if (Object.prototype.hasOwnProperty.call(e, 'updatedAt')) {
          e.updatedAt = format(new Date(e.updatedAt), 'yyyy-MM-dd HH:mm:ss')
        }
        return e
      })
      commit('FETCH_TASKS', tasks.reverse())
    },

    async addTask({ commit }, task) {
      try {
        let { data: _task } = await Vue.prototype.$http.post('/todo', task)
        _task.updatedAt = format(new Date(_task.updatedAt), 'yyyy-MM-dd HH:mm:ss')
        commit('ADD_TASK', _task)
      } catch (err) {
        console.log('add task failed')
      }
    },
    async deleteTask({ commit }, _id) {
      try {
        await Vue.prototype.$http.delete(`/todo/${_id}`)
        commit('DELETE_TASK', _id)
      } catch (err) {
        console.log('err while delete the task', err)
      }
    },

    // update the task, including done / undone / edit name
    async updateTask({ commit }, { _id, updates }) {
      try {
        await Vue.prototype.$http.patch(`/todo/${_id}`, updates)
        commit('UPDATE_TASK', { _id, updates })
      } catch (err) {
        console.log('updateTask error: ', err)
      }
    }
  }
}
