import Vue from 'vue'
import Vuex from 'vuex'
import { db } from './db'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [],
    snackbar: {
      show: false,
      text: ''
    }
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
    UPDATE_TASK_TITLE(state, { id, newTitle }) {
      const task = state.tasks.find(task => task.id === id)
      task.title = newTitle
    },
    UPDATE_TASK_DUE_DATE(state, { id, due_date }) {
      const task = state.tasks.find(task => task.id === id)
      task.due_date = due_date
    },
    SHOW_SNACKBAR(state, text) {
      state.snackbar.show = true
      state.snackbar.text = text
    },
    UPDATE_TASKS(state, tasks) {
      state.tasks = tasks
      console.log('UPDATE_TASKS', state.tasks)
    }
  },
  actions: {
    async fetchTasks({ commit }) {
      const tasks = await db.tasks.toArray()
      commit('FETCH_TASKS', tasks.reverse())
    },

    async saveTasks({ commit }, tasks) {
      try {
        await db.tasks.clear()
        await db.tasks.bulkAdd(tasks)
        commit('UPDATE_TASKS', tasks)
      } catch (err) {
        console.log('saveTasks', err)
      }
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
      commit('UPDATE_TASK_TITLE', { id, newTitle })
      const task = state.tasks.find(task => task.id === id)
      try {
        await db.tasks.put(task)
      } catch (err) {
        console.log('change task title failed', err)
      }
    },

    async changeTaskDueDate({ commit, state }, { id, due_date }) {
      commit('UPDATE_TASK_DUE_DATE', { id, due_date })
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
