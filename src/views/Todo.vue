<template>
  <div class="todo">
    <v-text-field
      v-model="newTaskTitle"
      @click:append="addTask"
      @keyup.enter="addTask"
      class="pa-3"
      outlined
      label="Add Task"
      append-icon="mdi-plus"
      hide-details
      clearable
    ></v-text-field>
    <v-list class="pt-0" flat v-if="tasks.length">
      <div v-for="task in tasks" :key="task.id">
        <v-list-item
          :class="{ 'blue lighten-5': task.done }"
          @click="doneTask(task.id)"
        >
          <template v-slot:default>
            <v-list-item-action>
              <v-checkbox :input-value="task.done" color="primary"></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title
                :class="{ 'text-decoration-line-through': task.done }"
                >{{ task.title }}</v-list-item-title
              >
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click.stop="deleteTask(task.id)">
                <v-icon color="primary lighten-1">mdi-dots-vertical</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
    <div v-else class="no-task">
      <v-icon color="primary lighten-1" x-large>mdi-check</v-icon>
      <h2 class="primary--text text--lighten-1">No Tasks</h2>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      Task added!
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      newTaskTitle: '',
      tasks: [],
      snackbar: false,
      timeout: 2000
    }
  },
  methods: {
    doneTask(id) {
      const task = this.tasks.find(task => task.id === id)
      task.done = !task.done
    },
    deleteTask(id) {
      const index = this.tasks.findIndex(task => task.id === id)
      this.tasks.splice(index, 1)
    },
    addTask() {
      if (this.newTaskTitle.trim() == '') return
      const newTask = {
        id: Date.now(),
        title: this.newTaskTitle,
        done: false
      }
      this.tasks.push(newTask)
      this.snackbar = true
      this.newTaskTitle = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.no-task {
  width: 100vw;
  padding-top: 40%;
  text-align: center;
}
</style>
