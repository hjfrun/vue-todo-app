<template>
  <div class="todo">
    <v-text-field
      v-model="newTaskTitle"
      @click:append="addTaskClick"
      @keyup.enter="addTaskClick"
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
          @click="DONE_TASK(task.id)"
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
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon dark v-bind="attrs" v-on="on">
                    <v-icon color="primary lighten-1">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in moreActions"
                    :key="index"
                    @click="actionClick(index, task.id)"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
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

    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Are you sure you wanna delete this task?
        </v-card-title>

        <v-card-text class="text-break-keep-all">
          {{ currentTask.title }}</v-card-text
        >

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary darken-1" text @click="deleteDialog = false">
            Cancel
          </v-btn>

          <v-btn color="red darken-2" text @click="deleteDialogConfirmclick">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Are you sure you wanna delete this task?
        </v-card-title>

        <v-card-text class="text-break-keep-all">
          {{ currentTask.title }}</v-card-text
        >

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary darken-1" text @click="editDialog = false">
            Cancel
          </v-btn>

          <v-btn color="red darken-2" text @click="editDialogConfirmclick">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      newTaskTitle: '',
      snackbar: false,
      timeout: 2000,
      moreActions: [
        {
          title: 'Edit',
          icon: 'mdi-pencil',
          action() {
            console.log('Edit task')
            this.editDialog = true
          }
        },
        {
          title: 'Due Date',
          icon: 'mdi-calendar',
          action() {
            console.log('due date')
          }
        },
        {
          title: 'Delete',
          icon: 'mdi-delete',
          action() {
            this.deleteDialog = true
          }
        },
        {
          title: 'Sort',
          icon: 'mdi-reorder-horizontal',
          action() {
            console.log('sort')
          }
        }
      ],
      deleteDialog: false,
      currentTask: { title: '', done: false },
      editDialog: false
    }
  },
  computed: {
    ...mapState(['tasks'])
  },
  created() {
    this.FETCH_TASKS()
  },
  methods: {
    ...mapActions(['FETCH_TASKS', 'ADD_TASK', 'DELETE_TASK', 'DONE_TASK']),
    addTaskClick() {
      if (this.newTaskTitle.trim() == '') return
      const newTask = {
        title: this.newTaskTitle,
        done: false
      }
      this.ADD_TASK(newTask)
      this.snackbar = true
      this.newTaskTitle = ''
    },
    actionClick(index, id) {
      this.currentTask = this.tasks.find(task => task.id === id)
      this.moreActions[index].action.call(this)
    },
    deleteDialogConfirmclick() {
      this.deleteDialog = false
      this.DELETE_TASK(this.currentTask.id)
    },
    editDialogConfirmclick() {
      this.editDialog = false
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

.text-break-keep-all {
  word-break: keep-all;
}
</style>
