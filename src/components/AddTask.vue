<template>
  <v-text-field
    v-model="newTaskName"
    @click:append="addTaskClick"
    @keyup.enter="addTaskClick"
    outlined
    :label="$t('addTask')"
    append-icon="mdi-plus"
    hide-details
    clearable
    v-loading.fullscreen.lock="fullscreenLoading"
  ></v-text-field>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'AddTask',
  data() {
    return {
      newTaskName: '',
      fullscreenLoading: false
    }
  },

  methods: {
    ...mapActions('task', ['addTask']),

    async addTaskClick() {
      if (this.newTaskName.trim() == '') return
      const newTask = {
        name: this.newTaskName,
        done: false,
        due_date: ''
      }
      this.fullscreenLoading = true
      await this.addTask(newTask)
      this.fullscreenLoading = false
      this.newTaskName = ''
    },
  }
}
</script>
