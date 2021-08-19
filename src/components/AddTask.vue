<template>
  <v-text-field
    v-model="newTaskTitle"
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
      newTaskTitle: ''
    }
  },

  methods: {
    ...mapActions(['addTask']),

    addTaskClick() {
      if (this.newTaskTitle.trim() == '') return
      const newTask = {
        title: this.newTaskTitle,
        done: false
      }
      this.addTask(newTask)
      this.$store.commit('SHOW_SNACKBAR', 'Task Added!')
      this.newTaskTitle = ''
    },
  }
}
</script>
