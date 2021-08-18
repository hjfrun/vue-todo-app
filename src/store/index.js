import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: []
  },
  mutations: {
    addTask(state, task) {
      state.tasks.push(task)
    },
    deleteTask(state, id) {
      const index = state.tasks.findIndex(task => task.id === id)
      state.tasks.splice(index, 1)
    },
    doneTask(state, id) {
      const task = state.tasks.find(task => task.id === id)
      task.done = !task.done
    }
  },
  actions: {
  },
  modules: {
  }
})
