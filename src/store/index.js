import Vue from 'vue'
import Vuex from 'vuex'
import { db } from './db'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: []
  },
  mutations: {
    FETCH_TASKS(state, tasks) {
      state.tasks = tasks
    },
    ADD_TASK(state, task) {
      state.tasks.unshift(task)
    },
    DELETE_TASK(state, id) {
      const index = state.tasks.findIndex(task => task.id === id)
      state.tasks.splice(index, 1)
    },
    DONE_TASK(state, id) {
      const task = state.tasks.find(task => task.id === id)
      task.done = !task.done
    },
    CHANGE_TASK_TITLE(state, { id, newTitle }) {
      const task = state.tasks.find(task => task.id === id)
      task.title = newTitle
    },
    CHANGE_TASK_DUE_DATE(state, { id, due_date }) {
      const task = state.tasks.find(task => task.id === id)
      task.due_date = due_date
    }
  },
  actions: {
    async fetchTasks({ commit }) {
      const tasks = await db.tasks.toArray()
      commit('FETCH_TASKS', tasks.reverse())
    },

    async addTask({ commit }, task) {
      try {
        const id = await db.tasks.add(task)
        commit('ADD_TASK', task)
        console.log('add task', id)
      } catch (err) {
        console.log('add task failed')
      }
    },

    async deleteTask({ commit }, id) {
      try {
        await db.tasks.delete(id)
        commit('DELETE_TASK', id)
      } catch (err) {
        console.log('err while delete the task', err)
      }
    },

    async doneTask({ commit, state }, id) {
      commit('DONE_TASK', id)
      const task = state.tasks.find(task => task.id === id)
      try {
        await db.tasks.put(task)
      } catch (err) {
        console.log('done task failed', err)
      }
    },

    async changeTaskTitle({ commit, state }, { id, newTitle }) {
      commit('CHANGE_TASK_TITLE', { id, newTitle })
      const task = state.tasks.find(task => task.id === id)
      try {
        await db.tasks.put(task)
      } catch (err) {
        console.log('change task title failed', err)
      }
    },

    async changeTaskDueDate({ commit, state }, { id, due_date }) {
      commit('CHANGE_TASK_DUE_DATE', { id, due_date })
      const task = state.tasks.find(task => task.id === id)
      try {
        await db.tasks.put(task)
      } catch (err) {
        console.log('change due date failed', err)
      }
    }
  },
  modules: {
  }
})
