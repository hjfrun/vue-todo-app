import Vue from 'vue'
import Vuex from 'vuex'
import { db } from './db'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: []
  },
  mutations: {
    fetchTasks(state, tasks) {
      state.tasks = tasks
    },
    addTask(state, task) {
      state.tasks.unshift(task)
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
    async FETCH_TASKS({ commit }) {
      const tasks = await db.tasks.toArray()
      commit('fetchTasks', tasks)
    },

    async ADD_TASK({ commit }, task) {
      try {
        const id = await db.tasks.add(task)
        commit('addTask', task)
        console.log('add task', id)
      } catch (err) {
        console.log('add task failed')
      }
    },

    async DELETE_TASK({ commit }, id) {
      try {
        await db.tasks.delete(id)
        commit('deleteTask', id)
      } catch (err) {
        console.log('err while delete the task', err)
      }
    },

    async DONE_TASK({ commit, state }, id) {
      commit('doneTask', id)
      const task = state.tasks.find(task => task.id === id)
      try {
        await db.tasks.put(task)
      } catch (err) {
        console.log('done task failed', err)
      }
    }
  },
  modules: {
  }
})
