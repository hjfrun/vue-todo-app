import Vue from 'vue'

export default {
  namespaced: true,
  state: {
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
  },
  actions: {
    // Groups
    async fetchGroups({ commit }) {
      const { data: groups } = await Vue.prototype.$http.get('/group')
      commit('FETCH_GROUPS', groups.reverse())
    },

    async addGroup({ commit }, group) {
      try {
        const { data: _group } = await Vue.prototype.$http.post('/group', group)
        commit('ADD_GROUP', _group)
      } catch (err) {
        console.log('add task failed')
      }
    },

    async deleteGroup({ commit }, _id) {
      try {
        await Vue.prototype.$http.delete(`/group/${_id}`)
        commit('DELETE_GROUP', _id)
      } catch (err) {
        console.log('err while delete the task', err)
      }
    },

    async updateGroup({ commit }, { _id, updates }) {
      try {
        await Vue.prototype.$http.patch(`/group/${_id}`, updates)
        commit('UPDATE_GROUP', { _id, updates })
      } catch (err) {
        console.log('updateTask error: ', err)
      }
    }
  }
}
