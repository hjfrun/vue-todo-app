<template>
  <v-text-field
    v-model="newTaskName"
    @click:append="addTaskClick"
    @keyup.enter="addTaskClick"
    outlined
    label="Add Task"
    append-icon="mdi-plus"
    hide-details
    clearable
  ></v-text-field>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'AddTask',
  data() {
    return {
      newTaskName: ''
    }
  },

  methods: {
    ...mapActions('task', ['addTask']),

    addTaskClick() {
      if (this.newTaskName.trim() == '') return
      const newTask = {
        name: this.newTaskName,
        done: false,
        due_date: ''
      }
      this.addTask(newTask)
      this.newTaskName = ''
    },
  }
}
</script>
